export const getPosts = async (queryParams) => {
  // Remove empty string parameters
  const cleanParams = Object.fromEntries(
    Object.entries(queryParams).filter(([, value]) => value !== ""),
  );

  const url = `${import.meta.env.VITE_BACKEND_URL}/posts?${new URLSearchParams(
    cleanParams,
  )}`;
  console.log("Fetching from URL:", url);
  console.log("Query params:", cleanParams);

  const res = await fetch(url);
  const data = await res.json();
  console.log("Response data length:", data.length);
  return data;
};
export const createPost = async (token, post) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(post),
  });
  return await res.json();
};
