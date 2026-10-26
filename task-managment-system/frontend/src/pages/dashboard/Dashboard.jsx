import React, { useState } from 'react'
import DashboardHeader from '../../components/dashboard/DashboardHeader'
import DashboardWelcome from '../../components/dashboard/DashboardWelcome'
import TaskForm from '../../components/task/TaskForm'
import TaskList from '../../components/task/TaskList'
import { Spokes } from "@/components/spokes";
import { useQuery } from '@tanstack/react-query'
import api from "@/api/apiClients";

function Dashboard() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  
  const [editingTask, setEditingTask] = useState(null)

  const handleFormClose = () => {
    setShowCreateForm(false);
    setEditingTask(null)
  }

  const handleCreateTask = () => {
    setShowCreateForm(true)
  };

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowCreateForm(true)
  }

  const handlestateChange = (taskId, newState) => {
    // Implement the logic to change the state of the task with the given taskId
    //mutation to update the task state in the backend and update the UI accordingly
    console.log(`Change state of task with ID: ${taskId} to ${newState}`);
  } 
  const tasksquery=useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
     const response = await api.get('/task');
      return response.data;
    },
    retry: 1,
   });
 if (tasksquery.isLoading) {
   return (
     <div className="flex h-screen items-center justify-center">
       <Spokes className="size-16" />
     </div>
   );
 }

 if (tasksquery.isError) {
   return (
     <div className="flex h-screen items-center justify-center">
       <p className="text-red-500">
         Error fetching tasks: {tasksquery.error.message}
       </p>
     </div>
   );
 }
  return (
    <div className="min-h-screen bg-background">
      {/* header */}
      <DashboardHeader />
      {/* main content */}
      <main className="max-w-full  px-4 py-4 space-y-4">
        {/* welcome page */}
        <DashboardWelcome
          onCreateTask={handleCreateTask}
          showCreateForm={showCreateForm}
        />
        <TaskList
          tasks={tasksquery.data || []}
          isLoading={tasksquery.isLoading}
          onEditTask={handleEditTask}
          onstateChange={handlestateChange}
        />
        {/*  Task section*/}
      </main>
      {/* dailog form */}
      <TaskForm
        task={editingTask}
        open={showCreateForm || !!editingTask}
        onOpenChange={handleFormClose}
      />
    </div>
  );
}

export default Dashboard