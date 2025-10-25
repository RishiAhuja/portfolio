
import React, { useEffect, useRef, useState } from 'react';

interface Neuron {
  x: number;
  y: number;
  radius: number;
  color: string;
  connections: number[];
  vx: number;
  vy: number;
}

interface NeuralNetworkProps {
  eventCount: number; // Number of neurons will match number of timeline events
}

const NeuralNetwork: React.FC<NeuralNetworkProps> = ({ eventCount }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const neurons = useRef<Neuron[]>([]);
  const animationRef = useRef<number>(0);
  
  // Generate initial neurons and connections
  const initializeNetwork = () => {
    const neuronCount = Math.max(10, eventCount); // At least 10 neurons, or more if there are more events
    const newNeurons: Neuron[] = [];
    
    // Create neurons
    for (let i = 0; i < neuronCount; i++) {
      const radius = Math.random() * 2 + 2;
      newNeurons.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        radius,
        color: `rgba(${100 + Math.random() * 155}, ${100 + Math.random() * 155}, 255, ${0.3 + Math.random() * 0.7})`,
        connections: [],
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2
      });
    }
    
    // Create connections (each neuron connects to 1-3 others)
    for (let i = 0; i < newNeurons.length; i++) {
      const connectionCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < connectionCount; j++) {
        let target;
        do {
          target = Math.floor(Math.random() * newNeurons.length);
        } while (target === i);
        
        newNeurons[i].connections.push(target);
      }
    }
    
    neurons.current = newNeurons;
  };
  
  // Draw the network on canvas
  const drawNetwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    
    // Update positions
    for (const neuron of neurons.current) {
      // Move neurons slightly
      neuron.x += neuron.vx;
      neuron.y += neuron.vy;
      
      // Bounce off edges
      if (neuron.x <= neuron.radius || neuron.x >= dimensions.width - neuron.radius) {
        neuron.vx = -neuron.vx;
      }
      if (neuron.y <= neuron.radius || neuron.y >= dimensions.height - neuron.radius) {
        neuron.vy = -neuron.vy;
      }
    }
    
    // Draw connections
    ctx.lineWidth = 0.5;
    for (let i = 0; i < neurons.current.length; i++) {
      const neuron = neurons.current[i];
      for (const connectionIndex of neuron.connections) {
        const target = neurons.current[connectionIndex];
        
        // Calculate distance for connection opacity
        const dx = neuron.x - target.x;
        const dy = neuron.y - target.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = Math.min(dimensions.width, dimensions.height) * 0.3;
        
        // Only draw connections within a certain distance
        if (distance < maxDistance) {
          const opacity = 0.8 - (distance / maxDistance) * 0.7;
          ctx.strokeStyle = `rgba(113, 128, 150, ${opacity})`;
          ctx.beginPath();
          ctx.moveTo(neuron.x, neuron.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        }
      }
    }
    
    // Draw neurons
    for (const neuron of neurons.current) {
      ctx.fillStyle = neuron.color;
      ctx.beginPath();
      ctx.arc(neuron.x, neuron.y, neuron.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Pulse effect for random neurons
    if (Math.random() < 0.05) {
      const pulseIndex = Math.floor(Math.random() * neurons.current.length);
      const neuron = neurons.current[pulseIndex];
      
      // Draw pulse
      ctx.strokeStyle = 'rgba(113, 128, 150, 0.2)';
      ctx.beginPath();
      ctx.arc(neuron.x, neuron.y, neuron.radius * 2, 0, Math.PI * 2);
      ctx.stroke();
      
      // Propagate pulse to connections
      setTimeout(() => {
        for (const connectionIndex of neuron.connections) {
          const target = neurons.current[connectionIndex];
          ctx.strokeStyle = 'rgba(113, 128, 150, 0.15)';
          ctx.beginPath();
          ctx.arc(target.x, target.y, target.radius * 1.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      }, 100);
    }
    
    // Continue animation
    animationRef.current = requestAnimationFrame(drawNetwork);
  };
  
  // Handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        const width = canvasRef.current.parentElement.clientWidth;
        // Height is set to be approximately 40% of the viewport height
        const height = Math.min(400, window.innerHeight * 0.4);
        
        setDimensions({ width, height });
      }
    };
    
    // Initial setup
    updateDimensions();
    
    // Handle window resize
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      // Clean up animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Initialize network and start animation when dimensions change
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      initializeNetwork();
      drawNetwork();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, eventCount]);
  
  return (
    <div className="w-full overflow-hidden rounded-sm my-8 bg-bgShades-light/5 backdrop-blur-[1px]">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      />
    </div>
  );
};

export default NeuralNetwork;
