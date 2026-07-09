async function test() { 
  const res = await fetch("http://localhost:3000/api/tmdb?endpoint=search&query=India's%20Got%20Latent%20"); 
  const data = await res.json();
  console.log("Trailing space count:", data.data ? data.data.length : data); 
} 
test();
