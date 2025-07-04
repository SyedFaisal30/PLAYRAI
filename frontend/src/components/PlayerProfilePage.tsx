import React, { useState } from "react";
import { usePlayer } from "../hooks/usePlayer";
import { PlayerInfoComponent } from "./PlayerInfo";
import { Achievements } from "./Achievements";
import { Summary } from "./Summary";
import { FormatStatsComponent } from "./FormatStats";
import { LandingSection } from "./LandingSection";
import { StatsLoader } from "./Loader";
import type { PlayerFormats } from "../utils/types";
import { Info } from "lucide-react";

export const PlayerProfilePage: React.FC = () => {
  const [inputName, setInputName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [selectedFormat, setSelectedFormat] =
    useState<keyof PlayerFormats>("ODI");

  const { data, loading, error } = usePlayer(playerName);
  const [showTooltip, setShowTooltip] = useState(false);


  const handleSubmit = () => {
    if (inputName.trim()) {
      setPlayerName(inputName.trim());
      setSelectedFormat("Test");
    }
  };

  const formatKeys: (keyof PlayerFormats)[] = data?.formats
    ? (Object.keys(data.formats) as (keyof PlayerFormats)[])
    : [];

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-blue-200 via-blue-300 to-indigo-500 text-white font-sans pt-6 px-4">
      <h1 className="text-4xl font-extrabold mb-6 text-center tracking-wide drop-shadow-md">
        Player Info Lookup
      </h1>

      <div className="flex justify-center mb-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (inputName.trim()) handleSubmit();
          }}
          className="flex items-center flex-wrap gap-3 mb-8"
        >
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="Enter player name"
            className="max-w-md w-[50vw] rounded-md bg-blue-100 px-4 py-3 text-gray-900 font-medium border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          />

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={!inputName.trim()}
              className={`px-6 py-3 rounded-md font-semibold transition 
          ${
            inputName.trim()
              ? "bg-indigo-300 hover:bg-indigo-400 text-gray-900 shadow-md"
              : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}
            >
              Search
            </button>

            {/* Info icon with tooltip */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTooltip((prev) => !prev)}
                className="p-1 rounded-full bg-blue-300 hover:bg-blue-400 transition"
                aria-label="Info"
              >
                <Info className="w-5 h-5 text-white" />
              </button>

              {showTooltip && (
                <div className="absolute right-0 top-10 z-20 w-64 bg-white text-sm text-gray-700 border border-gray-300 rounded-md p-3 shadow-lg">
                  <strong>Note:</strong> Make sure the player name is accurate,
                  otherwise you may not get the correct image or data.
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      {!playerName && <LandingSection />}

      {/* Render loader overlay outside and above all content */}
      {loading && <StatsLoader />}

      {error && (
        <p className="text-center text-red-300 font-semibold">Error: {error}</p>
      )}
      {!loading && !error && !data && playerName && (
        <p className="text-center text-indigo-200 font-medium">
          No player data found.
        </p>
      )}

      {/* Player Data Display */}
      {data && (
        <div className="space-y-10">
          <PlayerInfoComponent
            profile={data.player_profile}
            info={data.player_info}
            searchedName={playerName}
          />
          <Achievements achievements={data.achievements} />
          <Summary summary={data.summary} />

          <h2 className="text-3xl font-bold border-b border-indigo-300 pb-2">
            Stats by Format
          </h2>

          {/* Format selection buttons */}
          <div className="flex space-x-4 justify-center mb-6">
            {formatKeys.map((format) => (
              <button
                key={format}
                onClick={() => setSelectedFormat(format)}
                className={`px-5 py-2 rounded-full font-semibold transition-colors
                  ${
                    selectedFormat === format
                      ? "bg-indigo-300 text-gray-900 shadow"
                      : "bg-indigo-800 text-indigo-300 hover:bg-indigo-700"
                  }`}
              >
                {format}
              </button>
            ))}
          </div>

          {/* Show stats for only selected format */}
          <FormatStatsComponent
            formatName={selectedFormat}
            stats={data.formats[selectedFormat]}
          />
          <footer className="mt-12 text-center italic text-indigo-300 text-sm">
            {data.note}
          </footer>
        </div>
      )}
    </div>
  );
};
