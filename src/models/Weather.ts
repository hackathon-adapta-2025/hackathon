interface WeatherAPIResponse {
    lat: number;
    lon: number;
    timezone: string;
    timezone_offset: number;

    current: {
        dt: number;
        sunrise: number;
        sunset: number;
        temp: number;
        feels_like: number;
        pressure: number;
        humidity: number;
        dew_point: number;
        uvi: number;
        clouds: number;
        visibility: number;
        wind_speed: number;
        wind_deg: number;
        weather: WeatherDescription[];
    };

    hourly: HourlyWeather[];
    daily: DailyWeather[];
    alerts?: WeatherAlert[];
}

interface WeatherDescription {
    id: number;
    main: string;        // Ex: "Clear", "Rain", "Clouds"
    description: string; // Ex: "céu limpo", "chuva leve"
    icon: string;        // Ex: "01d", "09n"
}

interface HourlyWeather {
    dt: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    weather: WeatherDescription[];
    pop: number; // Probabilidade de precipitação
}

interface DailyWeather {
    dt: number;
    sunrise: number;
    sunset: number;
    moonrise: number;
    moonset: number;
    moon_phase: number;
    temp: {
        day: number;
        min: number;
        max: number;
        night: number;
        eve: number;
        morn: number;
    };
    feels_like: {
        day: number;
        night: number;
        eve: number;
        morn: number;
    };
    pressure: number;
    humidity: number;
    dew_point: number;
    wind_speed: number;
    wind_deg: number;
    clouds: number;
    uvi: number;
    weather: WeatherDescription[];
    pop: number;
    rain?: number;
    snow?: number;
}

interface WeatherAlert {
    sender_name: string;
    event: string;
    start: number;
    end: number;
    description: string;
    tags: string[];
}

interface WeatherResponse {
    feels_like: number,
    uvi: "BAIXO" | "NORMAL" | "ALTO"
}

export default async function getWather(lat: string, lon: string): Promise<WeatherResponse | undefined> {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=985f75b944df309f95cb91aa8e355088&units=metric&lang=pt_br    `;

    const response = await fetch(url);
    if (!response.ok) {
        console.log(response, url);
        throw new Error("Error on openwwathermap API")
    }
    const data: WeatherAPIResponse = await response.json();

    const uvi = data.current.uvi;

    return  {
        feels_like: data.current.feels_like,
        uvi: uvi < 3 ? "BAIXO" : uvi < 6 ? "NORMAL" : "ALTO"
    };
}