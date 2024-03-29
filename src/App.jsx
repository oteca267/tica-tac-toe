import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useState } from 'react'
import { Square } from './components/Square'
import {TURNS } from './constants'
import { checkWinnerFrom , checkEndGame } from './login/board'
import { WinnerModal } from './components/WinnerModal'
import confetti from 'canvas-confetti'




function App() {
  const [board,setBoard] = useState(()=>{
  const boardFrontStorage = window.localStorage.getItem('board')
  return boardFrontStorage ? JSON.parse(boardFrontStorage) : Array(9).fill(null)
  })
  const [turn, setTurn] = useState(()=>{
    const turnFrontStorage = window.localStorage.getItem('turn')
    return turnFrontStorage ?? TURNS.X
  })
  const [winner, setWinner] = useState(null)

 

  
  const resetGame = () =>{
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }

  const updateBoard = (index)=>{
        if(board[index] || winner) return
        const newBoard = [...board]
        newBoard[index] = turn
        setBoard(newBoard)
        const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
        setTurn(newTurn)
        window.localStorage.setItem('board', JSON.stringify(newBoard))
        window.localStorage.setItem('turn', newTurn)
        const newWinner = checkWinnerFrom(newBoard)
        
        if(newWinner){
          confetti()
          setWinner(newWinner)
        }else if(checkEndGame(newBoard)){
          setWinner(false)
        }

  }
  return(
    <main className="board">
      <h1>tic tac toe</h1>
      <button onClick={resetGame}>reset del juego</button>
      <section className="game">
        {
          board.map((square,index) =>{
            return (
              <Square 
              key={index}
              index={index}
              updateBoard={updateBoard}
              >
               {square}
              </Square>
            )
          })
        }
      </section>
      <section className='turn'>
        <Square isSelected={turn === TURNS.X} >
          {TURNS.X}
        </Square>
        <Square isSelected={turn === TURNS.O} >
          {TURNS.O}
        </Square>
      </section>
      <WinnerModal resetGame={resetGame} winner={winner}/>
    </main>
    )
}

export default App
