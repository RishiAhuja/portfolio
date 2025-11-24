import React, { useState, useEffect } from 'react';
import { getAllSideQuests, updateSideQuest, getSideQuestsWithHistory, type SideQuest, type SideQuestWithHistory } from '../../lib/admin';

interface SideQuestsEditorProps {
  token: string;
}

const SideQuestsEditor: React.FC<SideQuestsEditorProps> = ({ token }) => {
  const [quests, setQuests] = useState<SideQuest[]>([]);
  const [questsWithHistory, setQuestsWithHistory] = useState<SideQuestWithHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);

  useEffect(() => {
    loadQuests();
    loadHistory();
  }, []);

  const loadQuests = async () => {
    setIsLoading(true);
    try {
      const data = await getAllSideQuests(token);
      setQuests(data);
    } catch (error) {
      console.error('Error loading side quests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const data = await getSideQuestsWithHistory(token);
      setQuestsWithHistory(data);
      if (data.length > 0 && !selectedQuestId) {
        setSelectedQuestId(data[0].id);
      }
    } catch (error) {
      console.error('Error loading side quest history:', error);
    }
  };

  const handleUpdate = async (id: string, value: number, max_value: number) => {
    try {
      await updateSideQuest(token, id, { value, max_value });
      loadQuests();
      loadHistory();
      setEditingId(null);
    } catch (error) {
      console.error('Error updating side quest:', error);
      alert('Error updating side quest');
    }
  };

  if (isLoading) {
    return <div className="text-gunSmoke">Loading...</div>;
  }

  const selectedQuest = questsWithHistory.find(q => q.id === selectedQuestId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Editor */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-quillGray mb-4">Side Quests (Gym Stats)</h3>
        
        {quests.map((quest) => (
        <div key={quest.id} className="bg-darkGrey/20 p-4 rounded-lg">
          {editingId === quest.id ? (
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gunSmoke block mb-1">Exercise</label>
                <input
                  type="text"
                  value={quest.label}
                  disabled
                  className="w-full px-3 py-2 bg-darkGrey/50 text-quillGray rounded border border-darkGrey/50 cursor-not-allowed"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gunSmoke block mb-1">Current (kg)</label>
                  <input
                    type="number"
                    value={quest.value}
                    onChange={(e) => setQuests(quests.map(q => 
                      q.id === quest.id ? { ...q, value: parseInt(e.target.value) || 0 } : q
                    ))}
                    className="w-full px-3 py-2 bg-darkGrey/50 text-quillGray rounded border border-darkGrey/50 focus:border-accent-light focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gunSmoke block mb-1">Max (kg)</label>
                  <input
                    type="number"
                    value={quest.max_value}
                    onChange={(e) => setQuests(quests.map(q => 
                      q.id === quest.id ? { ...q, max_value: parseInt(e.target.value) || 0 } : q
                    ))}
                    className="w-full px-3 py-2 bg-darkGrey/50 text-quillGray rounded border border-darkGrey/50 focus:border-accent-light focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdate(quest.id, quest.value, quest.max_value)}
                  className="px-4 py-2 bg-accent-light text-codGray rounded hover:bg-accent-light/90 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    loadQuests();
                  }}
                  className="px-4 py-2 bg-darkGrey/50 text-gunSmoke rounded hover:bg-darkGrey/70 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <div className="text-quillGray font-medium">{quest.label}</div>
                <div className="text-sm text-gunSmoke">
                  {quest.value} / {quest.max_value} kg ({Math.round((quest.value / quest.max_value) * 100)}%)
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedQuestId(quest.id)}
                  className={`px-4 py-2 rounded transition-colors ${
                    selectedQuestId === quest.id
                      ? 'bg-accent-light/20 text-accent-light border border-accent-light/40'
                      : 'bg-darkGrey/50 text-gunSmoke hover:bg-darkGrey/70'
                  }`}
                >
                  View History
                </button>
                <button
                  onClick={() => setEditingId(quest.id)}
                  className="px-4 py-2 bg-darkGrey/50 text-accent-light rounded hover:bg-darkGrey/70 transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      </div>

      {/* Right Column - Progress Chart */}
      <div className="bg-darkGrey/20 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-quillGray mb-4">Progress History</h3>
        
        {selectedQuest && selectedQuest.history.length > 0 ? (
          <div className="space-y-6">
            {/* Quest Selector */}
            <div className="flex flex-wrap gap-2">
              {questsWithHistory.map((quest) => (
                <button
                  key={quest.id}
                  onClick={() => setSelectedQuestId(quest.id)}
                  className={`px-3 py-1.5 text-sm rounded transition-colors ${
                    selectedQuestId === quest.id
                      ? 'bg-accent-light text-codGray'
                      : 'bg-darkGrey/50 text-gunSmoke hover:bg-darkGrey/70'
                  }`}
                >
                  {quest.label}
                </button>
              ))}
            </div>

            {/* Simple Line Chart */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gunSmoke">
                <span>Progress over time</span>
                <span>Latest: {selectedQuest.value} kg</span>
              </div>
              
              {/* Chart Area */}
              <div className="relative h-64 bg-codGray/50 rounded p-4">
                <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none">
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map((percent) => (
                    <line
                      key={percent}
                      x1="0"
                      y1={200 - (percent * 2)}
                      x2="400"
                      y2={200 - (percent * 2)}
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Progress line */}
                  <polyline
                    points={selectedQuest.history.map((entry, i) => {
                      const x = (i / (selectedQuest.history.length - 1 || 1)) * 400;
                      const y = 200 - ((entry.value / selectedQuest.max_value) * 200);
                      return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="rgb(var(--accent-light))"
                    strokeWidth="2"
                  />
                  
                  {/* Data points */}
                  {selectedQuest.history.map((entry, i) => {
                    const x = (i / (selectedQuest.history.length - 1 || 1)) * 400;
                    const y = 200 - ((entry.value / selectedQuest.max_value) * 200);
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="4"
                        fill="rgb(var(--accent-light))"
                      />
                    );
                  })}
                </svg>
                
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gunSmoke py-4">
                  <span>{selectedQuest.max_value}kg</span>
                  <span>{Math.round(selectedQuest.max_value * 0.75)}kg</span>
                  <span>{Math.round(selectedQuest.max_value * 0.5)}kg</span>
                  <span>{Math.round(selectedQuest.max_value * 0.25)}kg</span>
                  <span>0kg</span>
                </div>
              </div>
              
              {/* History List */}
              <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                <h4 className="text-sm font-medium text-quillGray mb-2">All Records</h4>
                {selectedQuest.history.slice().reverse().map((entry, i) => (
                  <div key={i} className="flex justify-between text-sm bg-codGray/30 p-2 rounded">
                    <span className="text-gunSmoke">
                      {new Date(entry.recorded_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <span className="text-accent-light font-medium">
                      {entry.value} kg
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gunSmoke">
            {selectedQuest ? 'No history recorded yet' : 'Select a quest to view history'}
          </div>
        )}
      </div>
    </div>
  );
};

export default SideQuestsEditor;
