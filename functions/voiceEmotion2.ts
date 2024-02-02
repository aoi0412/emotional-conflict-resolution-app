export async function uploadFileToChunkEndpoint(file: File) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(process.env.NEXT_PUBLIC_EMPATH_URL || "", {
      method: "POST",
      headers: { ApiKey: process.env.NEXT_PUBLIC_EMPATH_API_KEY || "" },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log("File uploaded successfully!");
      console.log("Response from server:");
      console.log(data.talkUnits);
    } else {
      console.error(
        `Failed to upload the file. StatusCode: ${response.status}`
      );
      console.error(await response.text());
    }
  } catch (error: any) {
    console.error("Error uploading file:", error.message);
  }
}

// Usage example (this part would likely be triggered by a file input event in your actual application)
// document.getElementById('fileInput').addEventListener('change', async (event) => {
//     const file = event.target.files[0]; // Assuming you're uploading the first selected file
//     if (!file) {
//         console.error('No file selected!');
//         return;
//     }

//     const uploadUrl = 'https://webapi.webempath.com/api/v2/analysis/chunk'; // Replace with your URL
//     const authKey = 'your_auth_key_here'; // Replace with your auth key

//     await uploadFileToChunkEndpoint(uploadUrl, file, authKey);
// });
