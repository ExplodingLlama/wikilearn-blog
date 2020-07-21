import React from 'react';

const Loading = () => {
  const messages = [
    "Please hold your horses, we are going to space and back to fetch you some choice written prose, hastly written by deluded rubber socks wearing tiny elves...",
    "Attention all web surfers, especially you Sir, yes YOU, the one reading this. There are some words coming down on to your screen, in a few moments, keep looking at this sentence...",
    "Remember a time before all this internet nonsense? It's really important that you imagine that moment right now, so that my slow as a glacier website gets some much needed seconds to fetch some words...",
    "So, then I said to him, why not make a static website? It loads quicker, a much required requirement in today's time, and he said, 'Nah, I will just add some long winded loading messages'... ",
    "This website is supposed to load slowly so as to infuriate the user enough that they leave before they are able to read my horrendous writing..."
  ]
  const message = messages[Math.floor((Math.random() * 4))]
  return (
    <div style={{ padding: '20px', fontSize: '30px', color: '#aaa', marginTop: '40px'}}>
      {message}
    </div>
  )
}

export default Loading;
