"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  CalendarIcon,
  ChevronLeftIcon,
  HeartIcon,
  StarIcon,
  UserIcon,
  TrashIcon,
  Loader2Icon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  XCircleIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast, Toaster } from "sonner";
import { ConsiderationRecord } from "@/lib/types/types";

export default function ConsiderationPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [consideration, setConsideration] =
    useState<ConsiderationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchConsideration = async () => {
      if (!session?.user?.email || !id) return;

      try {
        const response = await fetch(
          `/api/considerations/${id}?email=${encodeURIComponent(
            session.user.email
          )}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Consideration not found");
          }
          throw new Error("Failed to fetch consideration");
        }

        const data = await response.json();
        setConsideration(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching consideration:", err);

        setLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchConsideration();
    }
  }, [session?.user?.email, id]);

  const handleDelete = async () => {
    if (!id || !session?.user?.email) return;

    try {
      setDeleteDialogOpen(false);
      const response = await fetch(`/api/considerations/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session.user.email }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete consideration");
      }

      toast.info("The consideration has been successfully removed.");

      // Navigate back to vault after successful deletion
      router.push("/vault");
    } catch (err) {
      console.error("Error deleting consideration:", err);
      toast.error("Failed to delete consideration. Please try again.");
    }
  };

  // Renders a rating as stars (filled and unfilled)
  const RatingDisplay = ({ value }: { value: number | null | undefined }) => {
    if (value === null || value === undefined)
      return <span className="text-gray-400">Not rated</span>;

    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          className={`h-4 w-4 ${
            i <= value ? "text-amber-500 fill-amber-500" : "text-gray-300"
          }`}
        />
      );
    }
    return <div className="flex gap-0.5">{stars}</div>;
  };

  // Section for displaying yes/no values with icons
  const BooleanDisplay = ({
    value,
    label,
  }: {
    value: boolean | null | undefined;
    label: string;
  }) => {
    if (value === null || value === undefined) return null;

    return (
      <div className="flex items-center gap-2 text-sm">
        {value ? (
          <CheckCircle2Icon className="h-4 w-4 text-green-500" />
        ) : (
          <XCircleIcon className="h-4 w-4 text-red-500" />
        )}
        <span>{label}</span>
      </div>
    );
  };

  // Display a note section if it exists
  const NotesSection = ({ notes }: { notes: string | null | undefined }) => {
    if (!notes) return null;

    return (
      <div className="mt-4 p-3 bg-slate-50 rounded-md">
        <h4 className="text-sm font-medium text-slate-700 mb-1">Notes:</h4>
        <p className="text-slate-600 text-sm whitespace-pre-line">{notes}</p>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-indigo-50 p-6 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2Icon className="h-12 w-12 text-violet-500 animate-spin" />
          <p className="text-violet-700">Loading consideration details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !consideration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-indigo-50 p-6">
        <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-red-100">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertTriangleIcon className="h-16 w-16 text-red-500" />
            <h1 className="text-2xl font-bold text-red-700">
              Error Loading Consideration
            </h1>
            <p className="text-slate-600">
              {error || "This consideration could not be found"}
            </p>
            <Button asChild>
              <Link href="/vault">Return to Vault</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Auth check
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-rose-50 to-indigo-50">
        <p className="text-lg text-gray-600">
          Please sign in to view consideration details
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-indigo-50 p-6">
      <div className="max-w-5xl mx-auto">
        <Toaster position="bottom-right" />

        {/* Back navigation */}
        <div className="mb-6">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
            asChild
          >
            <Link href="/vault">
              <ChevronLeftIcon className="h-4 w-4" />
              Back to Vault
            </Link>
          </Button>
        </div>

        {/* Header card */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm border border-pink-100/50 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-400/10 to-violet-400/10 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  {consideration.name}
                </h1>
                <div className="flex flex-wrap gap-4 mt-2 text-slate-600">
                  {consideration.age && (
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      <span>{consideration.age} years old</span>
                    </div>
                  )}
                  {consideration.date_met && (
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>
                        Met on{" "}
                        {format(
                          new Date(consideration.date_met),
                          "MMMM d, yyyy"
                        )}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <HeartIcon className="h-4 w-4 text-pink-500" />
                    <span>
                      Created{" "}
                      {format(
                        new Date(consideration.created_at),
                        "MMMM d, yyyy"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {/* Edit button  */}
                {/* <Button
                  variant="outline"
                  size="sm"
                  className="text-slate-600 border-slate-200"
                  asChild
                >
                  <Link href={`/edit-consideration/${consideration.id}`}>
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                </Button> */}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>

          {consideration.overall_notes && (
            <CardContent className="pt-6">
              <div className="mb-2 font-medium text-slate-700">
                Overall Notes
              </div>
              <div className="p-4 bg-slate-50 rounded-md text-slate-700 whitespace-pre-line">
                {consideration.overall_notes}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Assessment tabs */}
        <Tabs defaultValue="faith" className="mb-8">
          <TabsList className="mb-6 grid grid-cols-4 md:grid-cols-8">
            <TabsTrigger value="faith">Faith</TabsTrigger>
            <TabsTrigger value="character">Character</TabsTrigger>
            <TabsTrigger value="children">Children</TabsTrigger>
            <TabsTrigger value="friendship">Friendship</TabsTrigger>
            <TabsTrigger value="family">Family</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="roommate">Roommate</TabsTrigger>
            <TabsTrigger value="physical">Physical</TabsTrigger>
          </TabsList>

          {/* Faith tab */}
          <TabsContent value="faith">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-violet-800">
                  Faith Assessment
                </CardTitle>
                <CardDescription>
                  Spiritual compatibility and religious practice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <BooleanDisplay
                      value={consideration.faith_assessment?.is_catholic}
                      label="Is Catholic"
                    />

                    <div className="space-y-4 mt-4">
                      <div>
                        <div className="text-sm font-medium mb-1">
                          Practices Faith
                        </div>
                        <RatingDisplay
                          value={
                            consideration.faith_assessment?.practices_faith
                          }
                        />
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-1">
                          Shared Moral Values
                        </div>
                        <RatingDisplay
                          value={
                            consideration.faith_assessment?.shared_moral_values
                          }
                        />
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-1">
                          Helps Get to Heaven
                        </div>
                        <RatingDisplay
                          value={
                            consideration.faith_assessment?.helps_get_to_heaven
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <NotesSection notes={consideration.faith_assessment?.notes} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Character tab */}
          <TabsContent value="character">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-violet-800">
                  Character Assessment
                </CardTitle>
                <CardDescription>
                  Personality traits and temperament
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium mb-1">Friendly</div>
                    <RatingDisplay
                      value={consideration.character_assessment?.friendly}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Happy</div>
                    <RatingDisplay
                      value={consideration.character_assessment?.happy}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Polite</div>
                    <RatingDisplay
                      value={consideration.character_assessment?.polite}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Proud</div>
                    <RatingDisplay
                      value={consideration.character_assessment?.proud}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Discretion</div>
                    <RatingDisplay
                      value={consideration.character_assessment?.discretion}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Charitable</div>
                    <RatingDisplay
                      value={consideration.character_assessment?.charitable}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Humble</div>
                    <RatingDisplay
                      value={consideration.character_assessment?.humble}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Kind</div>
                    <RatingDisplay
                      value={consideration.character_assessment?.kind}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">
                      Positive Attitude
                    </div>
                    <RatingDisplay
                      value={
                        consideration.character_assessment?.positive_attitude
                      }
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Courageous</div>
                    <RatingDisplay
                      value={consideration.character_assessment?.courageous}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">
                      Self-Effacing
                    </div>
                    <RatingDisplay
                      value={consideration.character_assessment?.self_effacing}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">
                      Traditional Values
                    </div>
                    <RatingDisplay
                      value={
                        consideration.character_assessment?.traditional_values
                      }
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">
                      Political Alignment
                    </div>
                    <RatingDisplay
                      value={
                        consideration.character_assessment?.political_alignment
                      }
                    />
                  </div>
                </div>

                {consideration.character_assessment?.dating_history && (
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-1">
                      Dating History
                    </div>
                    <div className="p-3 bg-slate-50 rounded-md text-slate-700 text-sm">
                      {consideration.character_assessment.dating_history}
                    </div>
                  </div>
                )}

                <NotesSection
                  notes={consideration.character_assessment?.notes}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Children tab */}
          <TabsContent value="children">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-violet-800">
                  Children Assessment
                </CardTitle>
                <CardDescription>
                  Attitudes toward family and raising children
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-3">
                      <BooleanDisplay
                        value={
                          consideration.children_assessment?.wants_children
                        }
                        label="Wants Children"
                      />

                      <BooleanDisplay
                        value={
                          consideration.children_assessment?.will_raise_catholic
                        }
                        label="Will Raise Children Catholic"
                      />

                      {consideration.children_assessment
                        ?.number_of_children && (
                        <div className="text-sm mt-2">
                          <span className="font-medium">
                            Desired Number of Children:
                          </span>{" "}
                          {consideration.children_assessment.number_of_children}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 mt-4">
                      <div>
                        <div className="text-sm font-medium mb-1">
                          Likes Children
                        </div>
                        <RatingDisplay
                          value={
                            consideration.children_assessment?.likes_children
                          }
                        />
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-1">
                          Children Gravitate To
                        </div>
                        <RatingDisplay
                          value={
                            consideration.children_assessment
                              ?.children_gravitate
                          }
                        />
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-1">
                          Nurturing
                        </div>
                        <RatingDisplay
                          value={consideration.children_assessment?.nurturing}
                        />
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-1">
                          Excited About Babies
                        </div>
                        <RatingDisplay
                          value={
                            consideration.children_assessment
                              ?.excited_about_babies
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <NotesSection
                    notes={consideration.children_assessment?.notes}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Friendship tab */}
          <TabsContent value="friendship">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-violet-800">
                  Friendship Assessment
                </CardTitle>
                <CardDescription>
                  Companionship and relationship dynamics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium mb-1">Fun</div>
                    <RatingDisplay
                      value={consideration.friendship_assessment?.fun}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">
                      Shared Interests
                    </div>
                    <RatingDisplay
                      value={
                        consideration.friendship_assessment?.shared_interests
                      }
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Adventurous</div>
                    <RatingDisplay
                      value={consideration.friendship_assessment?.adventurous}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Outdoorsy</div>
                    <RatingDisplay
                      value={consideration.friendship_assessment?.outdoorsy}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Curious</div>
                    <RatingDisplay
                      value={consideration.friendship_assessment?.curious}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Creative</div>
                    <RatingDisplay
                      value={consideration.friendship_assessment?.creative}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Conversation</div>
                    <RatingDisplay
                      value={consideration.friendship_assessment?.conversation}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">
                      Communication
                    </div>
                    <RatingDisplay
                      value={consideration.friendship_assessment?.communication}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">
                      Conflict Resolution
                    </div>
                    <RatingDisplay
                      value={
                        consideration.friendship_assessment?.conflict_resolution
                      }
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Unselfish</div>
                    <RatingDisplay
                      value={consideration.friendship_assessment?.unselfish}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">
                      Enjoyable Company
                    </div>
                    <RatingDisplay
                      value={
                        consideration.friendship_assessment?.enjoyable_company
                      }
                    />
                  </div>
                </div>

                <NotesSection
                  notes={consideration.friendship_assessment?.notes}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Family tab */}
          <TabsContent value="family">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-violet-800">
                  Family Assessment
                </CardTitle>
                <CardDescription>
                  Family background and social relationships
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {consideration.family_assessment
                      ?.parents_marital_status && (
                      <div className="text-sm mb-4">
                        <span className="font-medium">
                          Parents&apos; Marital Status:
                        </span>{" "}
                        {consideration.family_assessment.parents_marital_status}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium mb-1">
                          Solid Family Background
                        </div>
                        <RatingDisplay
                          value={
                            consideration.family_assessment
                              ?.solid_family_background
                          }
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">
                          Family Values
                        </div>
                        <RatingDisplay
                          value={consideration.family_assessment?.family_values}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">
                          Family Functioning
                        </div>
                        <RatingDisplay
                          value={
                            consideration.family_assessment?.family_functioning
                          }
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">
                          Sibling Relationships
                        </div>
                        <RatingDisplay
                          value={
                            consideration.family_assessment
                              ?.sibling_relationships
                          }
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">
                          Enjoy Family
                        </div>
                        <RatingDisplay
                          value={consideration.family_assessment?.enjoy_family}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">
                          Friend Group
                        </div>
                        <RatingDisplay
                          value={consideration.family_assessment?.friend_group}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">
                          Gets Along With Your Family
                        </div>
                        <RatingDisplay
                          value={
                            consideration.family_assessment
                              ?.gets_along_with_your_family
                          }
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">
                          Gets Along With Your Friends
                        </div>
                        <RatingDisplay
                          value={
                            consideration.family_assessment
                              ?.gets_along_with_your_friends
                          }
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">
                          Possessive
                        </div>
                        <RatingDisplay
                          value={consideration.family_assessment?.possessive}
                        />
                      </div>
                    </div>
                  </div>

                  <NotesSection
                    notes={consideration.family_assessment?.notes}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business tab */}
          <TabsContent value="business">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-violet-800">
                  Business Assessment
                </CardTitle>
                <CardDescription>
                  Financial compatibility and work ethic
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {consideration.business_assessment?.debt && (
                      <div className="text-sm mb-4">
                        <span className="font-medium">Debt Situation:</span>{" "}
                        {consideration.business_assessment.debt}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium mb-1">Saver</div>
                        <RatingDisplay
                          value={consideration.business_assessment?.saver}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">Wasteful</div>
                        <RatingDisplay
                          value={consideration.business_assessment?.wasteful}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">
                          Maintenance
                        </div>
                        <RatingDisplay
                          value={consideration.business_assessment?.maintenance}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">
                          Willing To Sacrifice
                        </div>
                        <RatingDisplay
                          value={
                            consideration.business_assessment
                              ?.willing_to_sacrifice
                          }
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">
                          Risk Taker
                        </div>
                        <RatingDisplay
                          value={consideration.business_assessment?.risk_taker}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">
                          Financial Responsibility
                        </div>
                        <RatingDisplay
                          value={
                            consideration.business_assessment
                              ?.financial_responsibility
                          }
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">
                          Self Starter
                        </div>
                        <RatingDisplay
                          value={
                            consideration.business_assessment?.self_starter
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <NotesSection
                    notes={consideration.business_assessment?.notes}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roommate tab */}
          <TabsContent value="roommate">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-violet-800">
                  Roommate Assessment
                </CardTitle>
                <CardDescription>
                  Living habits and domestic compatibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-1">Tidiness</div>
                      <RatingDisplay
                        value={consideration.roommate_assessment?.tidiness}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Dishes</div>
                      <RatingDisplay
                        value={consideration.roommate_assessment?.dishes}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">
                        Personal Space
                      </div>
                      <RatingDisplay
                        value={
                          consideration.roommate_assessment?.personal_space
                        }
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">
                        Housekeeping
                      </div>
                      <RatingDisplay
                        value={consideration.roommate_assessment?.housekeeping}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">
                        Shares Burden
                      </div>
                      <RatingDisplay
                        value={consideration.roommate_assessment?.shares_burden}
                      />
                    </div>
                  </div>

                  <NotesSection
                    notes={consideration.roommate_assessment?.notes}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Physical tab */}
          <TabsContent value="physical">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-violet-800">
                  Physical Assessment
                </CardTitle>
                <CardDescription>
                  Physical attraction and health considerations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-1">Attraction</div>
                      <RatingDisplay
                        value={consideration.physical_assessment?.attraction}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Fitness</div>
                      <RatingDisplay
                        value={consideration.physical_assessment?.fitness}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">
                        Health Conscious
                      </div>
                      <RatingDisplay
                        value={
                          consideration.physical_assessment?.health_conscious
                        }
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Hygiene</div>
                      <RatingDisplay
                        value={consideration.physical_assessment?.hygiene}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">
                        Family Longevity
                      </div>
                      <RatingDisplay
                        value={
                          consideration.physical_assessment?.family_longevity
                        }
                      />
                    </div>
                  </div>

                  <NotesSection
                    notes={consideration.physical_assessment?.notes}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Consideration</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this consideration for{" "}
                {consideration.name}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
