import React, { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Loader2, Activity } from 'lucide-react';
import { supabase } from './lib/supabaseClient';
import { AuthPage } from './components/AuthPage';
import { OnboardingForm } from './components/OnboardingForm';
import { App } from './App';

type Stage = 'loading' | 'signed_out' | 'onboarding' | 'dashboard';

export const AuthGate: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [businessName, setBusinessName] = useState<string | undefined>(undefined);
  const [stage, setStage] = useState<Stage>('loading');

  const checkProfile = async (activeSession: Session) => {
    const { data, error } = await supabase
      .from('business_profiles')
      .select('business_name')
      .eq('id', activeSession.user.id)
      .maybeSingle();

    if (error) {
      console.error('Failed to check business profile:', error.message);
    }

    if (data) {
      setBusinessName(data.business_name);
      setStage('dashboard');
    } else {
      setStage('onboarding');
    }
  };

  useEffect(() => {
    // 1. Check for an existing session on load
    supabase.auth.getSession().then(({ data: { session: initial } }) => {
      setSession(initial);
      if (initial) {
        checkProfile(initial);
      } else {
        setStage('signed_out');
      }
    });

    // 2. React to sign-in / sign-out / token refresh events
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        checkProfile(newSession);
      } else {
        setBusinessName(undefined);
        setStage('signed_out');
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (stage === 'loading') {
    return (
      <div className="min-h-screen bg-[#080C14] flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <Activity className="w-8 h-8 text-rose-500 animate-pulse" />
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      </div>
    );
  }

  if (stage === 'signed_out' || !session) {
    return <AuthPage />;
  }

  if (stage === 'onboarding') {
    return (
      <OnboardingForm
        session={session}
        onComplete={() => checkProfile(session)}
      />
    );
  }

  return (
    <App
      businessName={businessName}
      userEmail={session.user.email ?? undefined}
      onSignOut={() => supabase.auth.signOut()}
    />
  );
};
