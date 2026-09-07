'use client';

import { useAuth } from '@/contexts/AuthContext';
import { canAccessAdminPanel } from "@/lib/roles";
import { useSermons, useUserNotifications, useUserDonations, useAnnouncements } from '@/hooks/useFirestore';
import { useRouter } from 'next/navigation';
import { sendEmailVerification } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  BookOpen, 
  Heart, 
  Users, 
  Calendar, 
  TrendingUp,
  Clock,
  PlayCircle,
  DollarSign,
  Megaphone
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { convertTimestampToDate } from '@/lib/firestore-utils';

export default function DashboardPage() {
  const { user, firebaseUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [sendingVerification, setSendingVerification] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleResendVerification = async () => {
    if (!firebaseUser) return;
    try {
      setSendingVerification(true);
      await sendEmailVerification(firebaseUser);
      setVerificationSent(true);
    } catch (error) {
      console.error('Error sending verification email:', error);
    } finally {
      setSendingVerification(false);
    }
  };

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin?redirect=/dashboard');
    }
  }, [user, authLoading, router]);

  // Fetch data using Firebase hooks
  const { data: recentSermons, loading: sermonsLoading } = useSermons(false, undefined, 3);
  const { data: notifications, loading: notificationsLoading } = useUserNotifications(user?.id || null, true);
  const { data: donations, loading: donationsLoading } = useUserDonations(user?.id || null);
  const { data: announcements, loading: announcementsLoading } = useAnnouncements(3);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  const totalDonations = donations.reduce((sum, donation) => 
    donation.status === 'COMPLETED' ? sum + donation.amount : sum, 0
  );

  const unreadNotificationsCount = notifications.length;

  return (
    <div className="min-h-screen bg-muted dark:bg-gray-900">
      {/* Email verification banner */}
      {!user.emailVerified && (
        <div className="bg-amber-50 dark:bg-amber-950 border-b border-amber-200 dark:border-amber-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Please verify your email address to secure your account. Check your inbox for the verification link.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResendVerification}
              disabled={sendingVerification || verificationSent}
            >
              {sendingVerification ? 'Sending…' : verificationSent ? 'Email Sent ✓' : 'Resend Email'}
            </Button>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="bg-card dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-foreground dark:text-white">
                Welcome back, {user.name?.split(' ')[0]}!
              </h1>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/profile">
                  Edit Profile
                </Link>
              </Button>
              {canAccessAdminPanel(user.role) && (
                <Button size="sm" asChild>
                  <Link href="/admin">
                    Admin Panel
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Giving</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{totalDonations.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                From {donations.filter(d => d.status === 'COMPLETED').length} donations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadNotificationsCount}</div>
              <p className="text-xs text-muted-foreground">
                Unread messages
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Sermons</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentSermons.length}</div>
              <p className="text-xs text-muted-foreground">
                New this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Member Since</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user.joinedChurchDate 
                  ? formatDistanceToNow(convertTimestampToDate(user.joinedChurchDate), { addSuffix: false })
                  : 'N/A'
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Time with us
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Sermons */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Recent Sermons
                </CardTitle>
                <CardDescription>
                  Stay updated with the latest messages
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sermonsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : recentSermons.length > 0 ? (
                  <div className="space-y-4">
                    {recentSermons.map((sermon) => (
                      <div key={sermon.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted dark:hover:bg-gray-800 transition-colors">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <PlayCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link href={`/sermons/${sermon.id}`}>
                            <h4 className="text-sm font-medium text-foreground dark:text-white hover:text-blue-600 cursor-pointer">
                              {sermon.title}
                            </h4>
                          </Link>
                          <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                            By {sermon.preacherName}
                          </p>
                          <div className="flex items-center mt-1 space-x-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(convertTimestampToDate(sermon.createdAt), { addSuffix: true })}
                            </span>
                            {sermon.featured && (
                              <Badge variant="secondary" className="text-xs">Featured</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <Separator />
                    <div className="text-center">
                      <Button variant="outline" asChild>
                        <Link href="/sermons">View All Sermons</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <PlayCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No sermons available yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Notifications
                  {unreadNotificationsCount > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {unreadNotificationsCount}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notificationsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                        <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : notifications.length > 0 ? (
                  <div className="space-y-3">
                    {notifications.slice(0, 5).map((notification) => (
                      <div key={notification.id} className="text-sm">
                        <p className="font-medium text-foreground dark:text-white">
                          {notification.title}
                        </p>
                        <p className="text-muted-foreground dark:text-muted-foreground text-xs">
                          {notification.content.substring(0, 100)}...
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(convertTimestampToDate(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    ))}
                    <Separator />
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/notifications">View All</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No new notifications</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Announcements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Megaphone className="mr-2 h-5 w-5" />
                  Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {announcementsLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : announcements.length > 0 ? (
                  <div className="space-y-3">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="text-sm">
                        <p className="font-medium text-foreground dark:text-white">
                          {announcement.title}
                        </p>
                        <p className="text-muted-foreground dark:text-muted-foreground text-xs">
                          {announcement.content.substring(0, 80)}...
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(convertTimestampToDate(announcement.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Megaphone className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No announcements</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/give">
                    <Heart className="mr-2 h-4 w-4" />
                    Make a Donation
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/sermons">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse Sermons
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/users">
                    <Users className="mr-2 h-4 w-4" />
                    Member Directory
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/events">
                    <Calendar className="mr-2 h-4 w-4" />
                    Upcoming Events
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/announcements">
                    <Bell className="mr-2 h-4 w-4" />
                    Announcements
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/prayer-requests">
                    <Heart className="mr-2 h-4 w-4" />
                    Prayer Requests
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}