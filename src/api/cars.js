async function getCars() {
    const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json')
    const data = await response.json()
    return (data.Results)
}

export { getCars };