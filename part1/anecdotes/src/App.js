import { useState } from 'react'

const Button = (props) => <button onClick={props.clickFn}>{props.text}</button>
const Header = (props) => <div><h1>{props.text}</h1></div>
const ContentLine = (props) => <div>{props.text}</div>


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
  const [mostPopular, setMostPopular] = useState(0)

  const generateRandomInt = (max) => Math.floor(Math.random() * max) 

  const clickHandler = (max_range, updateFn) =>  () => {
    updateFn(generateRandomInt(max_range))
  }

  const updateVotes = (votes, selected_idx, mostPopular, setMostPopular) => {
    const voteHandler = () => {
      const copy = Object.values(votes)
      copy[selected_idx] += 1

      let max_val = Math.max(...copy)
      let max_idx = copy.indexOf(max_val)
      
      if ( max_idx !== mostPopular) {
        setMostPopular(max_idx)
      }
      setVotes(copy)
    }
    return voteHandler
  }
  
  return (
    <div>
      <Header text="Anecdote of the day" />
      <ContentLine text={anecdotes[selected]} />
      <ContentLine text={`has ${votes[selected]} votes`} />
      <Button clickFn={updateVotes(votes, selected, mostPopular, setMostPopular)} text="vote" />
      <Button clickFn={clickHandler(anecdotes.length-1, setSelected)} text="next anecdote" />
      <Header text="Anecdote with the most votes" />
      <ContentLine text={anecdotes[mostPopular]} />
    </div>
  )
}

export default App