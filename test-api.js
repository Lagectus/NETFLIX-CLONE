async function testLocalApi() {
  const url = `http://localhost:3000/api/tmdb?endpoint=search&query=India's%20Got%20Latent`;
  console.log("Fetching", url);
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}
testLocalApi();
