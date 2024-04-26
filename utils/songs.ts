function formatDuration(durationInSeconds: number) {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export const getAudioDuration = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);

    audio.onloadedmetadata = () => {
      const formattedDuration = formatDuration(audio.duration);
      resolve(formattedDuration); // Resolve with the formatted duration string
      URL.revokeObjectURL(audio.src); // Clean up object URL
    };

    audio.onerror = () => {
      reject(new Error("Failed to load audio file"));
      URL.revokeObjectURL(audio.src); // Clean up object URL
    };
  });
