import { useState, useRef, useEffect } from 'react';
import { DemoAccessManager, type DemoAccess, type PronunciationResult } from '@/lib/demo-access';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface DemoConfig {
  maxAttempts: number;
  sessionDuration: number;
  preOrderDiscount: number;
  regularPrice: number;
  preOrderPrice: number;
  preOrderDuration: number;
}

interface Props {
  config: DemoConfig;
  accessManager: DemoAccessManager;
  access: DemoAccess;
}

interface StoryScene {
  id: string;
  title: string;
  image?: string;
  dialogue?: {
    speaker: string;
    text: string;
  };
  narration?: string;
  prompt?: string;
  requiredPhrase?: string;
  responseOptions?: {
    id: string;
    text: string;
    phrase: string;
  }[];
}

const STORY_SCENES: StoryScene[] = [
  {
    id: 'confrontation',
    title: 'The Confrontation Begins',
    dialogue: {
      speaker: 'Journalist',
      text: 'Ms. Hayes, I need to speak with you. It\'s urgent.'
    },
    prompt: 'Respond professionally:',
    requiredPhrase: 'Of course. How can I help you?'
  },
  {
    id: 'accusation',
    title: 'The Accusations',
    dialogue: {
      speaker: 'Journalist',
      text: 'I have evidence your hotel promised "luxury dining experiences" that don\'t exist. What\'s your response?'
    },
    prompt: 'Choose your response:',
    responseOptions: [
      {
        id: 'professional',
        text: 'A: Professional acknowledgment',
        phrase: 'I appreciate your concern'
      },
      {
        id: 'defensive',
        text: 'B: Defensive response',
        phrase: 'That\'s completely false!'
      },
      {
        id: 'evasive',
        text: 'C: No comment',
        phrase: 'No comment'
      }
    ]
  },
  {
    id: 'investigation',
    title: 'Professional Damage Control',
    narration: 'The journalist leans forward, recording device in hand. Your next words could appear in tomorrow\'s headlines...',
    prompt: 'Maintain your professionalism:',
    requiredPhrase: 'Let me investigate these allegations thoroughly'
  },
  {
    id: 'responsibility',
    title: 'Taking Responsibility',
    dialogue: {
      speaker: 'Journalist',
      text: 'Our readers deserve answers. Will you take responsibility?'
    },
    prompt: 'Show your commitment to customers:',
    requiredPhrase: 'We take customer satisfaction seriously'
  }
];

export function InteractiveStory({ config, accessManager, access }: Props) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [lastResult, setLastResult] = useState<PronunciationResult | null>(null);
  const [sceneCompleted, setSceneCompleted] = useState(false);
  const [storyCompleted, setStoryCompleted] = useState(false);
  const [selectedPhrase, setSelectedPhrase] = useState<string>('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [attemptsRemaining, setAttemptsRemaining] = useState(access.attempts_remaining);

  const currentScene = STORY_SCENES[currentSceneIndex];
  const progress = ((currentSceneIndex + (sceneCompleted ? 1 : 0)) / STORY_SCENES.length) * 100;

  const startRecording = async () => {
    if (!accessManager.canAttempt() || attemptsRemaining <= 0) {
      alert('No attempts remaining. Please upgrade to continue.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        handlePronunciationAnalysis(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Microphone access required for pronunciation practice');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handlePronunciationAnalysis = async (audioBlob: Blob) => {
    const phrase = selectedPhrase || currentScene.requiredPhrase || '';
    
    try {
      const result = await accessManager.recordPronunciation(audioBlob, phrase);
      setLastResult(result);
      setAttemptsRemaining(result.attemptsRemaining);
      
      if (result.canProgress) {
        setSceneCompleted(true);
      }
    } catch (error) {
      console.error('Pronunciation analysis failed:', error);
      alert('Analysis failed. Please try again.');
    }
  };

  const proceedToNextScene = () => {
    if (currentSceneIndex < STORY_SCENES.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
      setSceneCompleted(false);
      setLastResult(null);
      setSelectedPhrase('');
    } else {
      setStoryCompleted(true);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          email: access.email,
          plan: 'starter-monthly',
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    }
  };

  if (storyCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
        <div className="max-w-4xl mx-auto py-16">
          {/* Results Summary */}
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Your Performance</h2>
              <div className="text-6xl font-bold text-blue-400 mb-4">
                {lastResult?.score || 75}%
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-green-400">✓</div>
                  <div>Crisis Communication</div>
                </div>
                <div>
                  <div className="text-yellow-400">⚠️</div>
                  <div>Professional Pronunciation</div>
                </div>
                <div>
                  <div className="text-green-400">✓</div>
                  <div>Maintaining Composure</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cliffhanger */}
          <Card className="bg-red-900 border-red-700">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">The Story Continues...</h3>
              <p className="text-lg mb-6">
                The journalist publishes the story anyway. Social media explodes with outrage. 
                Your staff is panicking, guests are checking out, and your hotel's reputation hangs by a thread.
              </p>
              
              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <h4 className="text-xl font-semibold mb-4">In the Full Course:</h4>
                <ul className="text-left space-y-2">
                  <li>🔥 Navigate viral social media attacks</li>
                  <li>🕵️ Conduct internal investigations</li>
                  <li>📺 Handle live TV interviews</li>
                  <li>👥 Manage staff morale during crisis</li>
                  <li>🏆 Rebuild your hotel's reputation</li>
                  <li>💼 Save your career and business</li>
                </ul>
              </div>

              <div className="mb-6">
                <div className="text-2xl font-bold">
                  <span className="line-through text-gray-400">${config.regularPrice}/month</span>
                  <span className="text-green-400 ml-2">${config.preOrderPrice}/month</span>
                </div>
                <p className="text-sm text-gray-300">Limited time offer</p>
              </div>

              <Button 
                onClick={handleCheckout}
                className="bg-red-600 hover:bg-red-700 text-xl px-8 py-4"
                size="lg"
              >
                Unlock Full Story - Start 7-Day Free Trial
              </Button>
              
              <p className="text-xs text-gray-400 mt-4">
                Cancel anytime. No commitment.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Progress Header */}
      <div className="bg-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold">Hotel Crisis: Episode 1</h1>
            <Badge variant="outline" className="text-white border-white">
              Attempts: {attemptsRemaining}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-400 mt-1">
            Scene {currentSceneIndex + 1} of {STORY_SCENES.length}
          </p>
        </div>
      </div>

      {/* Story Content */}
      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">{currentScene.title}</h2>
            
            {/* Scene Image Placeholder */}
            <div className="aspect-video bg-gray-700 rounded-lg mb-6 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-2">🏨</div>
                <p>Amelia's Office - Grandview Hotel</p>
              </div>
            </div>

            {/* Dialogue */}
            {currentScene.dialogue && (
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <div className="font-semibold text-blue-400 mb-2">
                  {currentScene.dialogue.speaker}:
                </div>
                <p className="text-lg italic">"{currentScene.dialogue.text}"</p>
              </div>
            )}

            {/* Narration */}
            {currentScene.narration && (
              <div className="bg-yellow-900 rounded-lg p-4 mb-6">
                <p className="text-yellow-100 italic">{currentScene.narration}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Your Turn Section */}
        <Card className="bg-blue-900 border-blue-700">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold mb-4 text-center">Your Turn</h3>
            
            <p className="text-center mb-6">{currentScene.prompt}</p>

            {/* Response Options */}
            {currentScene.responseOptions ? (
              <div className="space-y-3 mb-6">
                {currentScene.responseOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedPhrase(option.phrase)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                      selectedPhrase === option.phrase
                        ? 'border-blue-400 bg-blue-800'
                        : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div className="font-semibold">{option.text}</div>
                    <div className="text-sm text-gray-300 italic">"{option.phrase}"</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-gray-700 rounded-lg p-4 mb-6 text-center">
                <p className="text-lg font-semibold">
                  Say: "{currentScene.requiredPhrase}"
                </p>
              </div>
            )}

            {/* Recording Controls */}
            <div className="text-center">
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  disabled={(!selectedPhrase && !!currentScene.responseOptions) || attemptsRemaining <= 0}
                  className="bg-red-600 hover:bg-red-700 text-xl px-8 py-4"
                  size="lg"
                >
                  🎤 Start Recording
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  className="bg-red-800 hover:bg-red-900 text-xl px-8 py-4 animate-pulse"
                  size="lg"
                >
                  🔴 Stop Recording
                </Button>
              )}
            </div>

            {/* Feedback */}
            {lastResult && (
              <div className="mt-6 bg-gray-700 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-yellow-400">
                    {lastResult.score}%
                  </div>
                  <div className="text-sm text-gray-300">Pronunciation Score</div>
                </div>
                
                <div className="space-y-2 text-sm">
                  {lastResult.feedback.map((feedback, index) => (
                    <p key={index} className="text-gray-300">• {feedback}</p>
                  ))}
                </div>

                {sceneCompleted ? (
                  <div className="text-center mt-4">
                    <p className="text-green-400 mb-4">✓ Well done! You can proceed.</p>
                    <Button onClick={proceedToNextScene} className="bg-green-600 hover:bg-green-700">
                      Continue Story →
                    </Button>
                  </div>
                ) : (
                  <div className="text-center mt-4">
                    <p className="text-yellow-400">Score 60% or higher to continue the story</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}