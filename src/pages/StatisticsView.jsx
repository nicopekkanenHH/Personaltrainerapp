import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { groupBy, sumBy } from 'lodash';

const API_BASE_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api';

// Match the color scheme from CalendarView
const activityColors = {
  'Jogging': '#FF4B4B',
  'Zumba': '#4B83FF',
  'Spinning': '#4BFF4B',
  'Yoga': '#FFB74B',
  'Gym training': '#9B4BFF',
  'Gym Training': '#9B4BFF',
  'Fitness': '#ff1493',
  'Running': '#006400',
  'Dancing': '#8b008b'
};

const StatisticsView = () => {
  const [activityStats, setActivityStats] = useState([]);

  useEffect(() => {
    fetchTrainingStats();
  }, []);

  const fetchTrainingStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/gettrainings`);
      const trainings = await response.json();
      
      // Group trainings by activity
      const groupedByActivity = groupBy(trainings, 'activity');
      
      // Calculate total duration for each activity
      const stats = Object.entries(groupedByActivity).map(([activity, trainings]) => ({
        activity,
        totalDuration: sumBy(trainings, 'duration'),
        fill: activityColors[activity] || '#808080' // Use gray as fallback color
      }));
      
      // Sort by duration in descending order
      stats.sort((a, b) => b.totalDuration - a.totalDuration);
      
      setActivityStats(stats);
    } catch (error) {
      console.error('Error fetching training statistics:', error);
    }
  };

  // Custom tooltip component to match the style
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow">
        <Typography variant="subtitle2">{label}</Typography>
        <Typography variant="body2">Kokonaiskesto: {payload[0].value} min</Typography>
      </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader
          title={
            <Typography variant="h6" component="div">
              Harjoitusten Kokonaiskesto Aktiviteeteittain
            </Typography>
          }
        />
        <CardContent>
          {/* Väriavain */}
          <div className="flex flex-wrap gap-4 mb-6">
            {Object.entries(activityColors).map(([activity, color]) => (
              <div key={activity} className="flex items-center">
                <div 
                  className="w-4 h-4 mr-2 rounded"
                  style={{ backgroundColor: color }}
                />
              </div>
            ))}
          </div>

          {/* Kuvio */}
          <div style={{ height: 400, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityStats} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="activity" />
                <YAxis
                  label={{
                    value: 'Kesto (min)',
                    angle: -90,
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="totalDuration" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsView;