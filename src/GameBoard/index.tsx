import * as React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

import { boardTiles, Tile } from "./data";

import "../styles/board.css"; // Import updated CSS

interface Character {
  name: string;
  color: string;
}

interface Player {
  name: string;
  position: number;
  color: string;
  hasStarted: boolean;
  block: number; // if meets caligo -> block +1
}

const characters: Character[] = [
  { name: "Meymu", color: "#4A90E2" }, // 💙
  // { name: "Meowmi", color: "#222" }, // 🖤
  { name: "Miimu", color: "#FF99CC" }, // 🩷
  // { name: "Moa", color: "#9B59B6" }, // 💜
  // { name: "Muhmo", color: "#E74C3C" }, // ❤️
];

const BOARD_WIDTH = 9;

const findTileByIndex = (tiles: Tile[], index: number) =>
  tiles.find((tile) => tile.index === index);

const GameBoard: React.FC = () => {
  const { t } = useTranslation();
  const [turnOrder, setTurnOrder] = useState<string[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<number>(0);
  const [diceResult, setDiceResult] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [tiles, setTiles] = useState(boardTiles);

  const selectTurnOrder = (name: string) => {
    if (!turnOrder.includes(name)) {
      setTurnOrder([...turnOrder, name]);
    }
  };

  const startGame = () => {
    setPlayers(
      turnOrder.map((name) => {
        const char = characters.find((c) => c.name === name);
        return {
          name,
          position: 80,
          color: char ? char.color : "#000",
          hasStarted: false,
          block: 0,
        };
      })
    );
    setGameStarted(true);
  };

  const movingCharacter = async (currentPlayer: number, position: number) => {
    await new Promise((resolve) => setTimeout(resolve, 300)); // Delay để hiển thị animation

    setPlayers((prev) =>
      prev.map((player, index) =>
        index === currentPlayer
          ? { ...player, position, hasStarted: true }
          : player
      )
    );
  };

  const buyCity = (player: Player, newPos: number) => {
    // findTileByIndex(tiles, newPos)
    const tile = findTileByIndex(tiles, newPos);
    if (!tile) return;

    if (tile.type === "city" && !tile.owner) {
      // do you want to buy
      console.log("buying city");
      setTiles((prevTiles) =>
        prevTiles.map((_tile) =>
          _tile.index === tile.index ? { ..._tile, owner: player.name } : _tile
        )
      );
    }
    if (tile.type === "caligo") {
      // Go to jail for +one turn
      setPlayers((prev) =>
        prev.map((_player, index) =>
          _player.name === player.name
            ? { ...player, block: player.block + 1, position: newPos }
            : player
        )
      );
    }
  };

  const rollDice = async (): Promise<void> => {
    if (!gameStarted) return;
    console.log("current player", players[currentPlayer]);
    if (players[currentPlayer].block > 0) {
      setPlayers((prev) =>
        prev.map((player, index) =>
          index === currentPlayer
            ? { ...player, block: player.block - 1 }
            : player
        )
      );

      // Next player's turn
      setCurrentPlayer((prev) => (prev + 1) % players.length);

      return;
    }

    const dice1: number = Math.floor(Math.random() * 6) + 1;
    const dice2Options: number[] = [-3, -2, -1, 1, 2, 3];
    const dice2: number =
      dice2Options[Math.floor(Math.random() * dice2Options.length)];
    const diceRoll: number = dice1 + dice2;

    setDiceResult(`🎲 Dice 1: ${dice1} + Dice 2: ${dice2} = ${diceRoll}`);

    console.log();
    const curPos = players[currentPlayer].position;
    let newPos = curPos;

    if (
      diceRoll === 0 ||
      (diceRoll < 0 && !players[currentPlayer].hasStarted)
    ) {
      // Don't move
      return;
    }
    if (diceRoll > 0) {
      let count = diceRoll;
      while (count > 0) {
        if (newPos < BOARD_WIDTH - 1) {
          // Moving to the right
          newPos = newPos + 1;
        } else if (newPos > BOARD_WIDTH * (BOARD_WIDTH - 1)) {
          // Moving to the left
          newPos = newPos - 1;
        } else if (newPos % BOARD_WIDTH === 0) {
          // Moving up
          newPos = newPos - BOARD_WIDTH;
        } else if ((newPos + 1) % BOARD_WIDTH === 0) {
          // Moving down
          newPos = newPos + BOARD_WIDTH;
        }
        await movingCharacter(currentPlayer, newPos);
        count--;
      }
    } else {
      let count = -diceRoll;
      while (count > 0) {
        if (newPos < BOARD_WIDTH - 1) {
          // Moving to the left
          newPos = newPos - 1;
        } else if (newPos > BOARD_WIDTH * (BOARD_WIDTH - 1)) {
          // Moving to the right
          newPos = newPos + 1;
        } else if (newPos % BOARD_WIDTH === 0) {
          // Moving down
          newPos = newPos + BOARD_WIDTH;
        } else if ((newPos + 1) % BOARD_WIDTH === 0) {
          // Moving up
          newPos = newPos - BOARD_WIDTH;
        }
        await movingCharacter(currentPlayer, newPos);
        count--;
      }
    }

    console.log("sau khi moving", newPos);
    buyCity(players[currentPlayer], newPos);

    // Next player
    setCurrentPlayer((prev) => (prev + 1) % players.length);
  };

  return (
    <div className="game-container">
      <h1 className="game-title">{t("title")}</h1>
      {!gameStarted ? (
        <div className="setup-container">
          <h2>{t("selectTurnOrder")}</h2>
          {characters.map((char) => (
            <button
              key={char.name}
              className="character-button"
              onClick={() => selectTurnOrder(char.name)}
            >
              {char.name}
            </button>
          ))}
          <div className="selected-order">
            Turn Order: {turnOrder.join(" → ")}
          </div>
          {turnOrder.length === characters.length && (
            <Button onClick={startGame}>{t("startGame")}</Button>
          )}
        </div>
      ) : (
        <>
          {diceResult && (
            <div className="dice-result-overlay">{diceResult}</div>
          )}
          <div className="game-board">
            {tiles.map((tile) => (
              <div
                key={`${tile.row}-${tile.col}`}
                className={`tile ${tile.type}`}
                style={{
                  backgroundColor:
                    characters.find((char) => char.name === tile.owner)
                      ?.color || "inherrit",
                }}
              >
                {tile.name}
                {/* <span className="tile-position">{tile.index}</span> */}
                {players.map((player, idx) =>
                  player.position === tiles.indexOf(tile) ? (
                    <motion.div
                      key={idx}
                      className={`player-piece ${player.name.toLowerCase()}`}
                      style={{ backgroundColor: player.color }}
                      animate={{ y: [-5, 5, -5] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                    />
                  ) : null
                )}
              </div>
            ))}
          </div>
          <Button className="roll-dice" onClick={rollDice}>
            {t("rollDice")}
          </Button>
        </>
      )}
    </div>
  );
};

export default GameBoard;
