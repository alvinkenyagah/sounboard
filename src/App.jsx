import { useState, useRef, useEffect } from "react";

const sounds = [
  { id: 1, name: "Call Of Duty", file: "/sounds/COD.mp3", category: "gaming", icon: "🎮" },
  { id: 2, name: "Ford Chime", file: "/sounds/Ford.mp3", category: "vehicle", icon: "🚗" },
  { id: 3, name: "Funky Worm", file: "/sounds/FunkyWorm.mp3", category: "music", icon: "🎵" },
  { id: 4, name: "Horse SFX", file: "/sounds/HORSE.mp3", category: "animal", icon: "🐴" },
  { id: 5, name: "Laughing", file: "/sounds/Laughing.mp3", category: "human", icon: "😂" },
  { id: 6, name: "Missile-Locking", file: "/sounds/Missile.mp3", category: "military", icon: "🚀" },
  { id: 7, name: "Missile-Locking2", file: "/sounds/Missile2.mp3", category: "military", icon: "🎯" },
  { id: 8, name: "USA", file: "/sounds/USAA.mp3", category: "anthem", icon: "🇺🇸" },
  { id: 9, name: "USSR", file: "/sounds/USSR.mp3", category: "anthem", icon: "⭐" },
  { id: 10, name: "Wasted", file: "/sounds/Wasted.mp3", category: "gaming", icon: "💀" },
  { id: 11, name: "Yamete", file: "/sounds/Yamete.mp3", category: "voice", icon: "🗣️" },
  { id: 12, name: "Green Dog", file: "/sounds/Green.mp3", category: "meme", icon: "🐕" },
];

const categoryColors = {
  gaming: "from-purple-500 to-pink-600",
  vehicle: "from-blue-500 to-cyan-600",
  music: "from-green-500 to-teal-600",
  animal: "from-orange-500 to-red-600",
  human: "from-yellow-500 to-orange-600",
  military: "from-gray-600 to-gray-800",
  anthem: "from-red-500 to-blue-600",
  voice: "from-indigo-500 to-purple-600",
  meme: "from-pink-500 to-rose-600",
};

function App() {
  const [playing, setPlaying] = useState({});
  const [volume, setVolume] = useState(0.7);
  const [ripples, setRipples] = useState({});
  const audioRefs = useRef({});

  const createRipple = (soundId) => {
    setRipples((prev) => ({ ...prev, [soundId]: Date.now() }));
    setTimeout(() => {
      setRipples((prev) => {
        const newRipples = { ...prev };
        delete newRipples[soundId];
        return newRipples;
      });
    }, 600);
  };

  const toggleSound = (sound) => {
    createRipple(sound.id);

    // If already playing, stop it
    if (playing[sound.id]) {
      audioRefs.current[sound.id].pause();
      audioRefs.current[sound.id].currentTime = 0;
      setPlaying((prev) => ({ ...prev, [sound.id]: false }));
      return;
    }

    // Otherwise play it (without stopping others)
    const audio = new Audio(sound.file);
    audio.volume = volume;
    audioRefs.current[sound.id] = audio;
    audio.play().catch(console.error);

    // When it ends, mark as stopped
    audio.onended = () => {
      setPlaying((prev) => ({ ...prev, [sound.id]: false }));
    };

    setPlaying((prev) => ({ ...prev, [sound.id]: true }));
  };

  const stopAllSounds = () => {
    Object.keys(audioRefs.current).forEach((id) => {
      if (audioRefs.current[id]) {
        audioRefs.current[id].pause();
        audioRefs.current[id].currentTime = 0;
      }
    });
    setPlaying({});
  };

  // Update volume for all audio elements
  useEffect(() => {
    Object.values(audioRefs.current).forEach((audio) => {
      if (audio) audio.volume = volume;
    });
  }, [volume]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent animate-pulse">
            🎵 Soundboard
          </h1>
          <p className="text-xl text-gray-300 font-light">
            Click any button to play awesome sounds
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 mb-8 bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-300">🔊 Volume</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-sm text-gray-400 min-w-[3ch]">
              {Math.round(volume * 100)}%
            </span>
          </div>

          <button
            onClick={stopAllSounds}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-105 active:scale-95"
          >
            ⏹️ Stop All
          </button>
        </div>

        {/* Sound Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-6xl">
          {sounds.map((sound) => (
            <button
              key={sound.id}
              onClick={() => toggleSound(sound)}
              className={`
                relative overflow-hidden group
                p-6 rounded-2xl shadow-2xl text-center
                font-semibold transition-all duration-300 ease-out
                transform hover:scale-105 hover:-rotate-1 active:scale-95
                bg-gradient-to-br ${categoryColors[sound.category]}
                ${
                  playing[sound.id]
                    ? "ring-4 ring-white ring-opacity-50 animate-pulse shadow-2xl"
                    : "hover:shadow-2xl hover:shadow-purple-500/25"
                }
                backdrop-blur-sm border border-white/10
              `}
            >
              {/* Ripple Effect */}
              {ripples[sound.id] && (
                <div className="absolute inset-0 bg-white rounded-2xl animate-ping opacity-20"></div>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>

              {/* Content */}
              <div className="relative z-10">
                <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-200">
                  {playing[sound.id] ? "⏸️" : sound.icon}
                </div>
                <div className="text-sm font-bold text-white drop-shadow-lg">
                  {playing[sound.id] ? "Playing..." : sound.name}
                </div>
                {playing[sound.id] && (
                  <div className="text-xs text-white/80 mt-1">Click to stop</div>
                )}
              </div>

              {/* Animated border for playing state */}
              {playing[sound.id] && (
                <div className="absolute inset-0 rounded-2xl animate-spin">
                  <div className="h-full w-full rounded-2xl border-2 border-dashed border-white/50"></div>
                </div>
              )}

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 text-center text-gray-400 px-4">
          <p className="text-xs sm:text-sm">
            🎧 Use headphones for the best experience
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
            Multiple sounds can play simultaneously
          </p>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
        }
        .slider::-webkit-slider-thumb:hover {
          background: #a855f7;
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.8);
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default App;
