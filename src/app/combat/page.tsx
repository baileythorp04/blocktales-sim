"use client";

import { type } from "os";
import { useState, useEffect } from "react";
import { Game, Player } from "@/static/gameClasses";
import { Enemy, trotter, dummy, megaphoneMan } from "@/static/Enemy"
import { Action } from "@/static/Actions";
import Image from "next/image";
import { usePlayerBuild } from "@/context/PlayerBuildContext";
import { Card, CardType } from "@/static/Cards";
import CombatPlayer from "@/components/CombatPlayer";
import CombatEnemy from "@/components/CombatEnemy";
import { StatusType } from "@/static/StatusHolder";
import { cloneDeep } from "lodash"
import { Item } from "@/static/Items";
import ItemBox from "@/components/ItemBox";
import LogPanel from "@/components/LogPanel";
import { logger } from "@/static/logger";
import { useRouter } from "next/navigation";


let gameInstanceStack : Game[] = [] //includes all previous game states, not the current one

export default function Combat() {
  const router = useRouter();
  const { playerBuild } = usePlayerBuild();
  
  const [ game, setGame ] = useState<Game>(() => {
    logger.clear()
    const es = [trotter("1"), trotter("2"), trotter("3"), megaphoneMan()]
    const player = new Player(playerBuild)
    return new Game(player, es)
  })
  const [ canUndo, setCanUndo ] = useState<boolean>(false)
  const [ spError, setSpError ] = useState<boolean>(false)
  const [ hpError, setHpError ] = useState<boolean>(false)
  const [ selectedEnemyPosition, setSelectedEnemyPosition ] = useState<number>(0) 
  function handleEnemyClick(i: number) {
    setSelectedEnemyPosition(i)
  }

  useEffect(() => {
    if (playerBuild == undefined){
      router.push("/")
    } else {
      gameInstanceStack = []
    }
  }, [])

  useEffect(() => {
    setCanUndo(gameInstanceStack.length > 0)
  })

  function handleItemClick(item: Item, i: number): void {
    let g = cloneDeep(game)

    if (item.usable){
      doAction(g, item, i)
    }
  }

  function handleActionClick(action: Action): void {
    let g = cloneDeep(game)

    doAction(g, action)
  }

  function doAction(g: Game, action: Action, itemIndex: number = -1): void {
    // ### player action ###
    setSpError(false)
    setHpError(false)

    let enemy = g.getEnemyByPosition(selectedEnemyPosition)
    let result = g.player.checkActionCost(action) 
    if (result == "missing sp") {
      setSpError(true)
      return
    }
    if (result == "missing hp") {
      setHpError(true)
      return
    }
    if (result == "success") {
      //refund check
      logger.nextAction()
      if (action.isHeal && !g.player.canHeal()){
        g.player.addSp(g.player.spOnPass, "Passing")
      } else {
        g.player.doAction(action, enemy, g.enemies)
        if (action instanceof Item){
          g.player.items.splice(itemIndex, 1)
        }
      }




      g.player.endOfActionEffects() //leech heal
      g.enemies.forEach(e => e.endOfActionEffects()) //change stance

      /// ((( second-player-turn logic )))
      if (g.player.hasStatus(StatusType.DEFENDING) || g.player.hasStatus(StatusType.INVISIBLE) || g.player.canAct() == false) { g.player.hasAnotherAction = false }
      if (!g.player.hasAnotherAction){
        
        /// ### enemy action ####
        g.enemies.forEach((enemy) => {
          if (enemy.canAct()){
            enemy.doNextAction(g.player, g.enemies)
            if (enemy.haste == true){
              enemy.doNextAction(g.player, g.enemies)
            }
          }
        })

        /// ### start-of-turn effects ####
        logger.nextTurn()
        g.player.startOfTurnEffects()
        g.enemies.forEach((e) => {e.startOfTurnEffects()})
      }
      g.player.hasAnotherAction = !g.player.hasAnotherAction
        


      // ### entity isDead check ###
      if (g.player.isDead) {
        g.gameOver = true
      }
      g.enemies = g.enemies.filter(e => e.isDead == false)
      if (g.getEnemyByPosition(selectedEnemyPosition) == undefined){
        setSelectedEnemyPosition(g.enemies.length-1)
      }

      //### win check ### 
      if ( g.enemies.length == 0) {
        g.win = true
      }
      
      //turn has happened, store old gamestate as previous turn
      gameInstanceStack.push(game)

      g.loggerState = logger.getState()
      setGame(g)
    }
  }

  function handleUndo() {
    let prevState = gameInstanceStack.pop()
    if (prevState == undefined){
      console.error("no previous game state to undo to")
    } else {
      setGame(prevState)
      logger.setState(prevState.loggerState)
      
      setSpError(false)
      setHpError(false)
    }
  }

  function handleRestart() {
    let initState = gameInstanceStack[0]
    if (initState == undefined){
      console.error("no previous game state to restart to")
    } else {
      gameInstanceStack.push(game)
      setGame(initState)
      logger.setState(initState.loggerState)
      
      setSpError(false)
      setHpError(false)

    }
  }

  return (

    // #### BATTLEFIELD #### 
    <div className="bg-gray-200">
    <div className="bg-white container h-screen mx-auto flex flex-col">
      <div className="grid grid-cols-5 flex-1">
        <CombatPlayer icon={game.player.icon} hp={game.player.hp} maxHp={game.player.maxHp} sp={game.player.sp} maxSp={game.player.maxSp} statusHolder={game.player.statuses} atkBoost={game.player.attackBoost} armor={game.player.defense}/>
        {game.enemies.map((enemy, i) =>
        <div key={i} onClick={() => handleEnemyClick(i)} className={`cursor-pointer ${i == selectedEnemyPosition && "bg-amber-100"}`}>
          <CombatEnemy name={enemy.name} icon={enemy.icon} hp={enemy.hp} maxHp={enemy.maxHp} attack1={enemy.getActionName(0)} attack2={enemy.getActionName(1)} statusHolder={enemy.statuses} stance={enemy.stanceImmunity} haste={enemy.haste} armor={enemy.defense}/>
        </div>
        )}
      </div>

      {/* #### Bottom Section #### */}
      <div className="mt-2 flex flex-row flex-1">


        {/* #### Left column #### */}
        <div className="flex flex-col flex-1 gap-2 border-r-2"> 

        {/* #### ACTIVE CARDS/ACTIONS #### */}

          <div className="flex justify-center">
          <div className="flex flex-row flex-wrap w-[91%] gap-x-4 items-center">
            {game.player.getActions().map((action, i) => (
              <div key={i} className="cursor-pointer flex-shrink-0 w-[80px]" onClick={() => handleActionClick(action)}>
                <div className="grid grid-rows-4">
                  <Image
                    className="row-span-3"
                    src={"/cards/" + action.icon}
                    alt={action.name + " icon"}
                    width={80}
                    height={80}
                    />
                  {action.spCost > 0 && <div className="row-span-1 flex justify-center">{action.spCost} SP</div>}
                  {action.hpCost > 0 && <div className="row-span-1 flex justify-center">{action.hpCost} HP</div>}
                </div>
              </div>
            ))}
          </div>
          </div>


          {/* #### ITEMS #### */}
          {game.player.canAct() &&
          <div className="self-center">
            <div className="flex justify-center">
              <ItemBox itemList={game.player.items} onItemClick={handleItemClick} />
            </div>
          </div>
          }

        </div> {/* end of left column */}
        
        

        <div className="flex-1"> {/* center column */}

          {/* #### PASSIVE CARDS #### */}
          <div className="flex justify-center">

          {/* {game.player.cards.some(card => card.type != CardType.ACTIVE) && 
          <div className=" mt-2 flex justify-center w-full border">
            <div className="text-2xl">Passive Cards</div>
          </div>
          } */}

          <div className="flex flex-row flex-wrap w-[91%] gap-4 items-center">
            {game.player.cards.filter(card => card.type != CardType.ACTIVE).map((card, i) => (
              <div key={i} className={`w-[80px] flex-shrink-0 `}>
                <Image
                  className={`${!card.enabled && "grayscale"}`}
                  src={"/cards/" + card.icon}
                  alt={card.name + " icon"}
                  width={80}
                  height={80}
                  />
              </div>
            ))}
          </div>
          </div>


          {/* #### UNDO AND RESTART #### */}
          <div className="py-2">
            {canUndo
            ? <div className="flex justify-around my-8 w-full">
                <div onClick={() => handleUndo()} className={`w-30 p-4 flex justify-center  border bg-gray-200 border-gray-400 cursor-pointer`}>Undo</div>
                <div onClick={() => handleRestart()} className={`w-30 p-4 flex justify-center  border bg-gray-200 border-gray-400 cursor-pointer`}>Restart</div>
              </div>
            : <div className="flex justify-around my-8 w-full">
                <div className={`w-30 p-4 flex justify-center border bg-gray-100 text-gray-300 cursor-default`}>Undo</div>
                <div className={`w-30 p-4 flex justify-center border bg-gray-100 text-gray-300 cursor-default`}>Restart</div>
              </div>
            }
          </div>


             {/* #### COMMON ERRORS #### */}
            <div className="flex justify-center">
              { game.gameOver
              ? <div className="text-6xl">GAME OVER</div>
              : <div>
                  { spError && <div className="text-6xl">Not Enough SP</div> }
                  { hpError && <div className="text-6xl">Not Enough HP</div> }
                  { game.win && <div className="text-6xl">You Win!</div> }
                </div>
              }
            </div>
        </div>

        <div className="flex-1 border-l-2"> {/* right column */}
          <LogPanel />
        </div>

      </div>

    </div>
      </div>
  );
}
