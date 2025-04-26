"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeartIcon, Calendar, Star, Loader2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";

interface ConsiderationRecord {
  id: string;
  name: string;
  age: number | null;
  date_met: string | null;
  created_at: string;
  updated_at: string;
  overall_notes: string | null;
  faith_assessment?: any;
  character_assessment?: any;
  children_assessment?: any;
  friendship_assessment?: any;
  family_assessment?: any;
  business_assessment?: any;
  roommate_assessment?: any;
  physical_assessment?: any;
}

export default function Vault() {
  const { data: session } = useSession();
  const [considerations, setConsiderations] = useState<ConsiderationRecord[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchConsiderations = async () => {
      if (!session?.user?.email) return;

      try {
        const response = await fetch(
          `/api/considerations?email=${encodeURIComponent(session.user.email)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch considerations");
        }

        const data = await response.json();
        setConsiderations(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching considerations:", err);
        setError("Failed to load your considerations. Please try again later.");
        setLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchConsiderations();
    }
  }, [session?.user?.email]);

  const getAverageRating = (consideration: ConsiderationRecord) => {
    // This is a simplified example - you would need to calculate based on all the ratings
    const ratingFields = [
      consideration.faith_assessment?.practices_faith,
      consideration.character_assessment?.friendly,
      consideration.physical_assessment?.attraction,
      // Add more rating fields here
    ].filter(Boolean);

    if (ratingFields.length === 0) return 0;

    const sum = ratingFields.reduce((a, b) => a + b, 0);
    return (sum / ratingFields.length).toFixed(1);
  };

  const getTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy");
    } catch (e) {
      return "Unknown date";
    }
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-lg text-gray-600">
          Please sign in to view your vault
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              Your Consideration Vault
            </h1>
            <p className="text-slate-600 mt-2">
              Review and manage all your marriage considerations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Image
              src={session.user?.image || "/default-avatar.png"}
              width={40}
              height={40}
              alt="Profile"
              className="rounded-full border-2 border-violet-300"
            />
            <span className="font-medium text-slate-700">
              {session.user?.name}
            </span>
          </div>
        </header>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-8"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Considerations</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="highest">Highest Rated</TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 text-violet-500 animate-spin mr-2" />
              <p>Loading your considerations...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  // Retry fetching
                  // (Add your fetch logic here)
                }}
              >
                Try Again
              </Button>
            </div>
          ) : considerations.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg text-center">
              <div className="flex justify-center mb-6">
                <HeartIcon size={60} className="text-pink-300" />
              </div>
              <h3 className="text-2xl font-medium text-slate-800 mb-2">
                No considerations yet
              </h3>
              <p className="text-slate-600 mb-8">
                Start by adding your first marriage consideration
              </p>
              <Button className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600">
                <Link
                  href="/new-consideration"
                  className="flex items-center gap-2"
                >
                  <HeartIcon size={18} />
                  New Consideration
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <TabsContent
                value="all"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {renderConsiderationCards(considerations)}
              </TabsContent>

              <TabsContent
                value="recent"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {renderConsiderationCards(
                  [...considerations]
                    .sort(
                      (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                    )
                    .slice(0, 6)
                )}
              </TabsContent>

              <TabsContent
                value="highest"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {renderConsiderationCards(
                  [...considerations]
                    .sort(
                      (a, b) =>
                        Number(getAverageRating(b)) -
                        Number(getAverageRating(a))
                    )
                    .slice(0, 6)
                )}
              </TabsContent>
            </>
          )}
        </Tabs>

        <div className="flex justify-center mt-10">
          <Button className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white">
            <Link href="/new-consideration" className="flex items-center gap-2">
              <HeartIcon size={18} />
              Add New Consideration
            </Link>
          </Button>
        </div>

        <footer className="mt-16 text-center text-sm text-slate-500">
          <p>Your private space for meaningful reflections on marriage</p>
          <Link
            href="/home"
            className="text-violet-500 hover:text-violet-600 mt-2 inline-block"
          >
            Back to Home
          </Link>
        </footer>
      </div>
    </div>
  );

  function renderConsiderationCards(cardsToRender: ConsiderationRecord[]) {
    console.log("Cards to render:", cardsToRender);
    return cardsToRender.map((consideration) => (
      <Link
        href={`/consideration/${consideration.id}`}
        key={consideration.id}
        className="block transition-transform hover:scale-[1.02]"
      >
        <Card className="h-full bg-white/90 backdrop-blur-sm border border-pink-100/50 hover:shadow-lg transition-shadow overflow-hidden">
          <div className="absolute top-0 right-0 bg-gradient-to-r from-pink-400 to-violet-400 text-white px-3 py-1 rounded-bl-lg text-sm font-medium">
            {getTimeAgo(consideration.created_at)}
          </div>

          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span className="text-xl text-slate-800">
                {consideration.name}
              </span>
              <div className="flex items-center bg-amber-50 px-2 py-1 rounded-full">
                <Star className="h-4 w-4 text-amber-500 mr-1 fill-amber-500" />
                <span className="text-sm font-medium text-amber-700">
                  {getAverageRating(consideration)}
                </span>
              </div>
            </CardTitle>
            <CardDescription className="flex gap-2 items-center text-slate-500">
              {consideration.age && (
                <span className="text-sm">{consideration.age} years old</span>
              )}
              {consideration.date_met && (
                <div className="flex items-center gap-1">
                  <span>•</span>
                  <Calendar className="h-3 w-3" />
                  <span className="text-sm">
                    Met on{" "}
                    {format(new Date(consideration.date_met), "MMM d, yyyy")}
                  </span>
                </div>
              )}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {consideration.overall_notes ? (
                <p className="text-slate-700 text-sm line-clamp-3">
                  {consideration.overall_notes}
                </p>
              ) : (
                <p className="text-slate-500 italic text-sm">
                  No overall notes added
                </p>
              )}

              <div className="grid grid-cols-3 gap-2 pt-2">
                {renderConsiderationBadge(
                  "Faith",
                  consideration.faith_assessment?.is_catholic
                    ? "Catholic"
                    : "Not Catholic",
                  "bg-blue-50 text-blue-700"
                )}
                {renderConsiderationBadge(
                  "Children",
                  consideration.children_assessment?.wants_children
                    ? "Wants Kids"
                    : "No Kids",
                  "bg-green-50 text-green-700"
                )}
                {consideration.character_assessment &&
                  renderConsiderationBadge(
                    "Character",
                    "Reviewed",
                    "bg-purple-50 text-purple-700"
                  )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    ));
  }

  function renderConsiderationBadge(
    label: string,
    value: string,
    className: string
  ) {
    return (
      <div
        className={`text-xs px-2 py-1 rounded-full flex justify-center items-center ${className}`}
      >
        <span>{value}</span>
      </div>
    );
  }
}
