
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b bg-white/50 backdrop-blur-sm dark:bg-gray-950/50 dark:border-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Journal App</h1>
          <nav className="space-x-1 sm:space-x-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/write">Write</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/meme">Meme Creator</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/auth">Sign In</Link>
            </Button>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Capture your thoughts and creativity
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-400">
            A beautiful journal app for documenting your daily thoughts, ideas, experiences, and creating fun memes.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/write">Start Writing</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/meme">Create Memes</Link>
            </Button>
          </div>
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Journal</CardTitle>
              <CardDescription>Document your thoughts and feelings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">
                Create beautiful journal entries with formatting, stickers, and more. Track your mood and progress over time.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="secondary">
                <Link to="/write">Start Writing</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Meme Creator</CardTitle>
              <CardDescription>Create funny memes with AI assistance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">
                Generate hilarious memes with our AI-powered caption generator. Choose from templates or upload your own images.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="secondary">
                <Link to="/meme">Create Memes</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Progress Dashboard</CardTitle>
              <CardDescription>Track your writing journey</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">
                See statistics about your journal entries, mood trends, and writing consistency on your personal dashboard.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="secondary">
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </CardFooter>
          </Card>
        </section>
      </main>
      
      <footer className="bg-white/50 backdrop-blur-sm dark:bg-gray-950/50 border-t dark:border-gray-800 py-6 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="container mx-auto text-center text-gray-500 dark:text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Journal App. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
