import { useEffect, useState } from 'react'
import { CloudSun, Search, MapPin, Droplets, Wind, Thermometer } from 'lucide-react'
import { weddingPlanApi, weatherApi } from '../api/index.js'

const WEATHER_ICONS = {
  Clear: '☀️', Clouds: '☁️', Rain: '🌧️', Drizzle: '🌦️',
  Thunderstorm: '⛈️', Snow: '❄️', Mist: '🌫️', default: '🌤️'
}

export default function Weather({ onToast }) {
  const [plans, setPlans] = useState([])
  const [location, setLocation] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    weddingPlanApi.getAll().then(p => {
      setPlans(p)
      if (p[0]?.location) setLocation(p[0].location)
    })
  }, [])

  const getWeatherDescription = (code) => {
    if ([0].includes(code)) return 'Klarer Himmel'
    if ([1, 2, 3].includes(code)) return 'Bewölkt'
    if ([45, 48].includes(code)) return 'Nebel'
    if ([51, 53, 55, 56, 57].includes(code)) return 'Nieselregen'
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Regen'
    if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Schnee'
    if ([95, 96, 99].includes(code)) return 'Gewitter'
    return 'Wetterdaten verfügbar'
  }

  const getWeatherMain = (code) => {
    if ([0].includes(code)) return 'Clear'
    if ([1, 2, 3].includes(code)) return 'Clouds'
    if ([45, 48].includes(code)) return 'Mist'
    if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle'
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rain'
    if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snow'
    if ([95, 96, 99].includes(code)) return 'Thunderstorm'
    return 'default'
  }

  const fetchWeather = async () => {
    if (!location.trim()) return

    setLoading(true)
    setError('')

    try {
      const data = await weatherApi.getByCity(location)

      const current = data.weather.current
      const daily = data.weather.daily
      const currentCode = current.weather_code

      setWeather({
        city: data.city,
        temperature: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        description: getWeatherDescription(currentCode),
        main: getWeatherMain(currentCode),
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        visibility: '—',
        forecast: daily.time.map((date, index) => ({
          day: new Date(date).toLocaleDateString('de-DE', { weekday: 'short' }),
          min: Math.round(daily.temperature_2m_min[index]),
          max: Math.round(daily.temperature_2m_max[index]),
          main: getWeatherMain(daily.weather_code[index])
        }))
      })
    } catch (err) {
      console.error(err)
      setError('Wetter konnte nicht geladen werden. Bitte prüfe, ob das Backend läuft.')
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  const icon = weather ? (WEATHER_ICONS[weather.main] || WEATHER_ICONS.default) : null

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Wettervorhersage</h2>
          <p className="page-subtitle">Damit ihr wisst, ob der Außenbereich genutzt werden kann</p>
        </div>
      </div>

      {/* Suche */}
      <div className="card" style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14 }}>
          Wählt einen Ort oder gebt euren Hochzeitsort ein:
        </p>

        {/* Schnellauswahl aus Hochzeitsplänen */}
        {plans.filter(p => p.location).length > 0 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            {plans.filter(p => p.location).map(p => (
              <button
                key={p.id}
                className={`btn ${location === p.location ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: 13 }}
                onClick={() => setLocation(p.location)}
              >
                <MapPin size={13} /> {p.location}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <input
            className="form-input"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Stadt eingeben, z. B. München"
            onKeyDown={e => e.key === 'Enter' && fetchWeather()}
            style={{ flex: 1 }}
          />
          <button
            className="btn btn-primary"
            onClick={fetchWeather}
            disabled={loading}
            style={{ flexShrink: 0 }}
          >
            {loading ? '…' : <><Search size={15} /> Suchen</>}
          </button>
        </div>

        {error && (
          <div style={{
            marginTop: 12, padding: '10px 14px', borderRadius: 'var(--radius-md)',
            background: '#FFF8F0', border: '1px solid #FFE0C0',
            fontSize: 13, color: '#A06010'
          }}>
            ⚠️ {error}
          </div>
        )}
      </div>

      {weather && (
        <>
          {/* Haupt-Widget */}
          <div className="weather-widget" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <MapPin size={14} color="var(--lavender-deep)" />
                  <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--lavender-deep)' }}>{weather.city}</span>
                </div>
                <div className="weather-temp">{Math.round(weather.temperature)}°</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 6, textTransform: 'capitalize' }}>
                  {weather.description}
                </div>
              </div>
              <div style={{ fontSize: 72, lineHeight: 1 }}>{icon}</div>
            </div>

            <hr className="divider" style={{ borderColor: 'rgba(196, 174, 222, 0.3)' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { icon: <Droplets size={16} />, label: 'Luftfeuchtigkeit', value: `${weather.humidity}%` },
                { icon: <Wind size={16} />, label: 'Windgeschw.', value: `${Math.round(weather.windSpeed)} km/h` },
                { icon: <Thermometer size={16} />, label: 'Gefühlte Temp.', value: `${Math.round(weather.feelsLike)}°` },              ].map(({ icon, label, value }) => (
                <div key={label} style={{
                  background: 'rgba(255,255,255,0.5)',
                  borderRadius: 'var(--radius-md)', padding: '12px 14px',
                  display: 'flex', flexDirection: 'column', gap: 4
                }}>
                  <div style={{ color: 'var(--lavender-deep)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {icon}
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</span>
                  </div>
                  <div style={{ fontSize: 18, fontFamily: 'var(--font-display)', color: 'var(--lavender-deep)' }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5-Tage-Vorschau */}
          {weather.forecast && (
            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 20, marginBottom: 16 }}>
                5-Tage-Vorschau
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
                {weather.forecast.map(day => (
                  <div key={day.day} style={{
                    textAlign: 'center', padding: '16px 8px',
                    borderRadius: 'var(--radius-md)', background: 'var(--creme)',
                    border: '1px solid var(--creme-border)',
                    transition: 'all var(--transition)',
                    cursor: 'default'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--rose-light)'; e.currentTarget.style.borderColor = 'var(--rose)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--creme)'; e.currentTarget.style.borderColor = 'var(--creme-border)' }}
                  >
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{day.day}</div>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{WEATHER_ICONS[day.main] || WEATHER_ICONS.default}</div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{day.max}°</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{day.min}°</div>
                  </div>
                ))}
              </div>

              {/* Empfehlung */}
              <div style={{
                marginTop: 16, padding: '14px 18px', borderRadius: 'var(--radius-md)',
                background: weather.main === 'Rain' || weather.main === 'Thunderstorm'
                  ? '#FFF8F0' : 'var(--success-bg)',
                border: `1px solid ${weather.main === 'Rain' || weather.main === 'Thunderstorm' ? '#FFE0C0' : '#C8E6D0'}`,
              }}>
                <p style={{ fontSize: 13, color: weather.main === 'Rain' ? '#A06010' : '#3A7A48' }}>
                  {weather.main === 'Rain' || weather.main === 'Thunderstorm'
                    ? '🌂 Regen erwartet — plant lieber einen Ausweich-Innenraum ein.'
                    : '✅ Das Wetter sieht gut aus — einem Außenbereich steht nichts im Wege!'}
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {!weather && !loading && (
        <div className="empty-state card">
          <CloudSun size={48} color="var(--lavender)" style={{ margin: '0 auto' }} />
          <h3>Wetter abfragen</h3>
          <p>Gebt euren Hochzeitsort ein, um die Wettervorhersage zu sehen.</p>
        </div>
      )}
    </div>
  )
}
