export async function loginUser(email, password) {
  try {
    const response = await fetch("https://5558ace6a3dff7ca.mokky.dev/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        name: email.split("@")[0],
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Login xatosi")
    }

    const user = await response.json()
    localStorage.setItem("user", JSON.stringify(user))
    return user
  } catch (error) {
    throw error
  }
}

export function getUser() {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  }
  return null
}

export function setUser(email, password) {
  const user = { email, password, id: Date.now() }
  localStorage.setItem("user", JSON.stringify(user))
  return user
}

export function logout() {
  localStorage.removeItem("user")
}

export function isAuthenticated() {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("user")
  }
  return false
}
