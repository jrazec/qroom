exports.createFile = async (rooms) => {
  const payload = {
    document: {
      document_template_id: "D306EEFE-777B-46B5-8E46-23EF589AE5C5",
      payload: {
        products: rooms,
      },
    },
  };

  console.log("Payload being sent:", JSON.stringify(payload, null, 2)); // Log the payload

  try {
    const response = await fetch("https://api.pdfmonkey.io/api/v1/documents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PDFMONKEY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("API Response Status:", response.status); // Log the status code
    console.log("API Response Data:", data); // Log the response data

    if (!response.ok) {
      throw new Error(`API Error: ${JSON.stringify(data.errors)}`);
    }

    return data;
  } catch (error) {
    console.error("Error occurred:", error.message); // Log the error
    throw new Error(error.message);
  }
};


