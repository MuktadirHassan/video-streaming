async function getVideoURL() {
  const response = await fetch("http://localhost:5000/api/v1/videos");
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data = await response.json();
  return data.data[0].url;
}

export default async function Dashboard() {
  const videoURL = await getVideoURL();
  return (
    <div className="border aspect-video">
      <video src={videoURL} className="w-full h-full" controls></video>
    </div>
  );
}
