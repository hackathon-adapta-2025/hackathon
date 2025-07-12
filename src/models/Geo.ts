export default async function getGeoLocation(lat: string, lon: string) {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.length) {
        throw new Error("Latitude ou longitude não encontrado")
    }

    const location = data[0];

    return {
        city: location.name,
        state: location.state,
        country: location.country,
    };
}
