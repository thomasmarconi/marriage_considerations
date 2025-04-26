"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast, Toaster } from "sonner";
import { ConsiderationFormData, Rating } from "@/lib/types/types";
import postConsideration from "@/lib/functions/considerations/post-consideration";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeftIcon, HeartIcon, Lock } from "lucide-react";

export default function NewConsideration() {
  const [activeTab, setActiveTab] = useState("basic");
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<ConsiderationFormData>({
    basicInfo: {
      name: "",
      age: "",
      dateMet: "",
    },
    faith: {
      isCatholic: false,
      practicesFaith: 3,
      sharedMoralValues: 3,
      helpsGetToHeaven: 3,
      notes: "",
    },
    character: {
      friendly: 3,
      happy: 3,
      polite: 3,
      proud: 3,
      discretion: 3,
      charitable: 3,
      humble: 3,
      kind: 3,
      positiveAttitude: 3,
      courageous: 3,
      selfEffacing: 3,
      datingHistory: "",
      traditionalValues: 3,
      politicalAlignment: 3,
      notes: "",
    },
    children: {
      wantsChildren: false,
      numberOfChildren: "",
      willRaiseCatholic: false,
      likesChildren: 3,
      childrenGravitate: 3,
      nurturing: 3,
      excitedAboutBabies: 3,
      notes: "",
    },
    friendship: {
      fun: 3,
      sharedInterests: 3,
      adventurous: 3,
      outdoorsy: 3,
      curious: 3,
      creative: 3,
      conversation: 3,
      communication: 3,
      conflictResolution: 3,
      unselfish: 3,
      enjoyableCompany: 3,
      notes: "",
    },
    familyAndFriends: {
      solidFamilyBackground: 3,
      parentsMaritalStatus: "",
      familyValues: 3,
      familyFunctioning: 3,
      siblingRelationships: 3,
      enjoyFamily: 3,
      friendGroup: 3,
      getsAlongWithYourFamily: 3,
      getsAlongWithYourFriends: 3,
      possessive: 3,
      notes: "",
    },
    businessPartner: {
      saver: 3,
      wasteful: 3,
      maintenance: 3,
      willingToSacrifice: 3,
      riskTaker: 3,
      debt: "",
      financialResponsibility: 3,
      selfStarter: 3,
      notes: "",
    },
    roommate: {
      tidiness: 3,
      dishes: 3,
      personalSpace: 3,
      housekeeping: 3,
      sharesBurden: 3,
      notes: "",
    },
    physicalAttraction: {
      attraction: 3,
      fitness: 3,
      healthConscious: 3,
      hygiene: 3,
      familyLongevity: 3,
      notes: "",
    },
    overallNotes: "",
  });

  const handleChange = (
    category: keyof ConsiderationFormData,
    field: string,
    value: any
  ) => {
    setFormData({
      ...formData,
      [category]: {
        ...(formData[category as keyof ConsiderationFormData] as Record<
          string,
          string | number | boolean | Rating
        >),
        [field]: value,
      },
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleButtonClick = () => {
    // Validate basic info tab
    if (activeTab === "basic" && !formData.basicInfo.name.trim()) {
      toast.error("Please provide a name before continuing");
      return;
    }

    switch (activeTab) {
      case "basic":
        setActiveTab("faith");
        break;
      case "faith":
        setActiveTab("character");
        break;
      case "character":
        setActiveTab("family");
        break;
      case "family":
        setActiveTab("practical");
        break;
      case "practical":
        // On the last tab, submit the form
        handleSubmit();
        break;
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.basicInfo.name.trim()) {
      toast.error("Name is required");
      setActiveTab("basic");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await postConsideration(session?.user?.email, formData);

      toast.success("Consideration saved successfully!", {
        description: `Consideration for ${formData.basicInfo.name} has been saved.`,
      });

      // Redirect to vault after a short delay
      setTimeout(() => {
        router.push("/vault");
      }, 1500);
    } catch (error) {
      console.error("Failed to save consideration:", error);
      toast.error("Failed to save consideration", {
        description: "Please try again or check your connection.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enhanced RatingInput component with shadcn components
  const RatingInput = ({
    category,
    field,
    label,
  }: {
    category: keyof ConsiderationFormData;
    field: string;
    label: string;
  }) => (
    <div className="space-y-2">
      <Label htmlFor={`${category}.${field}`} className="text-slate-700">
        {label}
      </Label>
      <RadioGroup
        id={`${category}.${field}`}
        value={(formData[category] as any)[field].toString()}
        onValueChange={(value) =>
          handleChange(category, field, parseInt(value))
        }
        className="flex space-x-2"
      >
        {[1, 2, 3, 4, 5].map((rating) => (
          <div key={rating} className="flex items-center space-x-1">
            <RadioGroupItem
              value={rating.toString()}
              id={`${category}.${field}.${rating}`}
              className="text-violet-500"
            />
            <Label
              htmlFor={`${category}.${field}.${rating}`}
              className="text-sm cursor-pointer text-slate-600"
            >
              {rating}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );

  // Check for authentication
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-indigo-50 p-6 flex flex-col items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-pink-100/50 text-center max-w-md">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Sign In Required
          </h2>
          <p className="text-slate-600 mb-6">
            Please sign in to create a new consideration.
          </p>
          <Button asChild>
            <Link href="/api/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-indigo-50 p-6">
      <Toaster position="bottom-right" />

      <div className="max-w-5xl mx-auto">
        {/* Back navigation */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 border-slate-200"
              asChild
            >
              <Link href="/home">
                <ChevronLeftIcon className="h-4 w-4" />
                Return to Home
              </Link>
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 border-slate-200"
              asChild
            >
              <Link href="/vault">
                <Lock className="h-4 w-4" />
                Go to Vault
              </Link>
            </Button>
          </div>
        </div>

        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            New Marriage Consideration
          </h1>
          <p className="text-slate-600 mt-2">
            Record and evaluate a potential marriage partner
          </p>
        </header>

        <Card className="bg-white/90 backdrop-blur-sm border border-pink-100/50 shadow-lg mb-8">
          <CardContent className="pt-6">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid grid-cols-5 mb-8 bg-slate-100/80">
                <TabsTrigger
                  value="basic"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/10 data-[state=active]:to-violet-500/10"
                >
                  Basic Info
                </TabsTrigger>
                <TabsTrigger
                  value="faith"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/10 data-[state=active]:to-violet-500/10"
                >
                  Faith
                </TabsTrigger>
                <TabsTrigger
                  value="character"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/10 data-[state=active]:to-violet-500/10"
                >
                  Character
                </TabsTrigger>
                <TabsTrigger
                  value="family"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/10 data-[state=active]:to-violet-500/10"
                >
                  Family
                </TabsTrigger>
                <TabsTrigger
                  value="practical"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/10 data-[state=active]:to-violet-500/10"
                >
                  Practical
                </TabsTrigger>
              </TabsList>

              <div>
                <TabsContent value="basic" className="space-y-6">
                  {/* Basic Information */}
                  <Card className="border border-pink-100/20">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-violet-800">
                        Basic Information
                      </CardTitle>
                      <CardDescription>
                        The fundamental details about this person
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-slate-700">
                            Name <span className="text-rose-500">*</span>
                          </Label>
                          <Input
                            id="name"
                            value={formData.basicInfo.name}
                            onChange={(e) =>
                              handleChange("basicInfo", "name", e.target.value)
                            }
                            className="border-slate-200"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="age" className="text-slate-700">
                            Age
                          </Label>
                          <Input
                            id="age"
                            value={formData.basicInfo.age}
                            onChange={(e) =>
                              handleChange("basicInfo", "age", e.target.value)
                            }
                            className="border-slate-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dateMet" className="text-slate-700">
                            Date Met
                          </Label>
                          <Input
                            id="dateMet"
                            type="date"
                            value={formData.basicInfo.dateMet}
                            onChange={(e) =>
                              handleChange(
                                "basicInfo",
                                "dateMet",
                                e.target.value
                              )
                            }
                            className="border-slate-200"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Physical Attraction */}
                  <Card className="border border-pink-100/20">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-violet-800">
                        Physical Attraction
                      </CardTitle>
                      <CardDescription>
                        Physical attributes and health considerations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <RatingInput
                          category="physicalAttraction"
                          field="attraction"
                          label="Physical attraction level"
                        />
                        <RatingInput
                          category="physicalAttraction"
                          field="fitness"
                          label="Fitness level"
                        />
                        <RatingInput
                          category="physicalAttraction"
                          field="healthConscious"
                          label="Health conscious"
                        />
                        <RatingInput
                          category="physicalAttraction"
                          field="hygiene"
                          label="Personal hygiene"
                        />
                        <RatingInput
                          category="physicalAttraction"
                          field="familyLongevity"
                          label="Family longevity/health history"
                        />
                        <div className="col-span-1 md:col-span-2 space-y-2">
                          <Label
                            htmlFor="physicalNotes"
                            className="text-slate-700"
                          >
                            Notes on Physical Attraction
                          </Label>
                          <Textarea
                            id="physicalNotes"
                            value={formData.physicalAttraction.notes}
                            onChange={(e) =>
                              handleChange(
                                "physicalAttraction",
                                "notes",
                                e.target.value
                              )
                            }
                            className="min-h-[100px] border-slate-200"
                            placeholder="Any additional thoughts about physical attraction..."
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="faith" className="space-y-6">
                  {/* Faith */}
                  <Card className="border border-pink-100/20">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-violet-800">
                        Faith
                      </CardTitle>
                      <CardDescription>
                        Spiritual compatibility and religious practice
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="isCatholic"
                            checked={formData.faith.isCatholic}
                            onCheckedChange={(checked) =>
                              handleChange("faith", "isCatholic", checked)
                            }
                            className="text-violet-500"
                          />
                          <Label
                            htmlFor="isCatholic"
                            className="text-slate-700"
                          >
                            Is she Catholic?
                          </Label>
                        </div>

                        <RatingInput
                          category="faith"
                          field="practicesFaith"
                          label="Practices her Christian faith"
                        />
                        <RatingInput
                          category="faith"
                          field="sharedMoralValues"
                          label="Shared moral values"
                        />
                        <RatingInput
                          category="faith"
                          field="helpsGetToHeaven"
                          label="Will help me get to heaven"
                        />

                        <div className="space-y-2">
                          <Label
                            htmlFor="faithNotes"
                            className="text-slate-700"
                          >
                            Notes on Faith
                          </Label>
                          <Textarea
                            id="faithNotes"
                            value={formData.faith.notes}
                            onChange={(e) =>
                              handleChange("faith", "notes", e.target.value)
                            }
                            className="min-h-[150px] border-slate-200"
                            placeholder="Describe her faith journey, beliefs, and how they align with yours..."
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Character tab content with similar styling updates */}
                <TabsContent value="character" className="space-y-6">
                  {/* Character/Beliefs/Social Behavior */}
                  <Card className="border border-pink-100/20">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-violet-800">
                        Character & Social Behavior
                      </CardTitle>
                      <CardDescription>
                        Personality traits and temperament
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <RatingInput
                          category="character"
                          field="friendly"
                          label="Friendly"
                        />
                        <RatingInput
                          category="character"
                          field="happy"
                          label="Happy"
                        />
                        <RatingInput
                          category="character"
                          field="polite"
                          label="Polite"
                        />
                        <RatingInput
                          category="character"
                          field="proud"
                          label="Proud"
                        />
                        <RatingInput
                          category="character"
                          field="discretion"
                          label="Discretion"
                        />
                        <RatingInput
                          category="character"
                          field="charitable"
                          label="Charitable"
                        />
                        <RatingInput
                          category="character"
                          field="humble"
                          label="Humble"
                        />
                        <RatingInput
                          category="character"
                          field="kind"
                          label="Kind"
                        />
                        <RatingInput
                          category="character"
                          field="positiveAttitude"
                          label="Positive Attitude"
                        />
                        <RatingInput
                          category="character"
                          field="courageous"
                          label="Courageous"
                        />
                        <RatingInput
                          category="character"
                          field="selfEffacing"
                          label="Self-Effacing"
                        />
                        <RatingInput
                          category="character"
                          field="traditionalValues"
                          label="Traditional Values"
                        />
                        <RatingInput
                          category="character"
                          field="politicalAlignment"
                          label="Political Alignment"
                        />
                        <div className="col-span-1 md:col-span-2 space-y-2">
                          <Label
                            htmlFor="datingHistory"
                            className="text-slate-700"
                          >
                            Dating History
                          </Label>
                          <Textarea
                            id="datingHistory"
                            value={formData.character.datingHistory}
                            onChange={(e) =>
                              handleChange(
                                "character",
                                "datingHistory",
                                e.target.value
                              )
                            }
                            className="min-h-[100px] border-slate-200"
                            placeholder="Details about past relationships..."
                          />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-2">
                          <Label
                            htmlFor="characterNotes"
                            className="text-slate-700"
                          >
                            Notes on Character
                          </Label>
                          <Textarea
                            id="characterNotes"
                            value={formData.character.notes}
                            onChange={(e) =>
                              handleChange("character", "notes", e.target.value)
                            }
                            className="min-h-[150px] border-slate-200"
                            placeholder="Additional observations about her character..."
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Friendship section with similar styling */}
                  {/* Friendship section */}
                  <Card className="border border-pink-100/20">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-violet-800">
                        Friendship
                      </CardTitle>
                      <CardDescription>
                        Companionship and relationship dynamics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <RatingInput
                          category="friendship"
                          field="fun"
                          label="Fun to be with"
                        />
                        <RatingInput
                          category="friendship"
                          field="sharedInterests"
                          label="Shared interests"
                        />
                        <RatingInput
                          category="friendship"
                          field="adventurous"
                          label="Adventurous"
                        />
                        <RatingInput
                          category="friendship"
                          field="outdoorsy"
                          label="Outdoorsy"
                        />
                        <RatingInput
                          category="friendship"
                          field="curious"
                          label="Curious"
                        />
                        <RatingInput
                          category="friendship"
                          field="creative"
                          label="Creative"
                        />
                        <RatingInput
                          category="friendship"
                          field="conversation"
                          label="Good conversation"
                        />
                        <RatingInput
                          category="friendship"
                          field="communication"
                          label="Communication skills"
                        />
                        <RatingInput
                          category="friendship"
                          field="conflictResolution"
                          label="Conflict resolution"
                        />
                        <RatingInput
                          category="friendship"
                          field="unselfish"
                          label="Unselfish"
                        />
                        <RatingInput
                          category="friendship"
                          field="enjoyableCompany"
                          label="Enjoyable company"
                        />
                        <div className="col-span-1 md:col-span-2 space-y-2">
                          <Label
                            htmlFor="friendshipNotes"
                            className="text-slate-700"
                          >
                            Notes on Friendship
                          </Label>
                          <Textarea
                            id="friendshipNotes"
                            value={formData.friendship.notes}
                            onChange={(e) =>
                              handleChange(
                                "friendship",
                                "notes",
                                e.target.value
                              )
                            }
                            className="min-h-[150px] border-slate-200"
                            placeholder="Thoughts on your friendship and how you get along..."
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Family tab content */}
                <TabsContent value="family" className="space-y-6">
                  {/* Children */}
                  <Card className="border border-pink-100/20">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-violet-800">
                        Children
                      </CardTitle>
                      <CardDescription>
                        Attitudes toward family and raising children
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="wantsChildren"
                            checked={formData.children.wantsChildren}
                            onCheckedChange={(checked) =>
                              handleChange("children", "wantsChildren", checked)
                            }
                            className="text-violet-500"
                          />
                          <Label
                            htmlFor="wantsChildren"
                            className="text-slate-700"
                          >
                            Wants children
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="willRaiseCatholic"
                            checked={formData.children.willRaiseCatholic}
                            onCheckedChange={(checked) =>
                              handleChange(
                                "children",
                                "willRaiseCatholic",
                                checked
                              )
                            }
                            className="text-violet-500"
                          />
                          <Label
                            htmlFor="willRaiseCatholic"
                            className="text-slate-700"
                          >
                            Will raise children Catholic
                          </Label>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="numberOfChildren"
                            className="text-slate-700"
                          >
                            Desired number of children
                          </Label>
                          <Input
                            id="numberOfChildren"
                            value={formData.children.numberOfChildren}
                            onChange={(e) =>
                              handleChange(
                                "children",
                                "numberOfChildren",
                                e.target.value
                              )
                            }
                            className="border-slate-200"
                            placeholder="e.g., 3-4, as many as possible, etc."
                          />
                        </div>

                        <RatingInput
                          category="children"
                          field="likesChildren"
                          label="Likes children"
                        />
                        <RatingInput
                          category="children"
                          field="childrenGravitate"
                          label="Children gravitate to her"
                        />
                        <RatingInput
                          category="children"
                          field="nurturing"
                          label="Nurturing"
                        />
                        <RatingInput
                          category="children"
                          field="excitedAboutBabies"
                          label="Excited about having babies"
                        />

                        <div className="space-y-2">
                          <Label
                            htmlFor="childrenNotes"
                            className="text-slate-700"
                          >
                            Notes on Children
                          </Label>
                          <Textarea
                            id="childrenNotes"
                            value={formData.children.notes}
                            onChange={(e) =>
                              handleChange("children", "notes", e.target.value)
                            }
                            className="min-h-[150px] border-slate-200"
                            placeholder="Thoughts on her approach to children and family planning..."
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Family and Friends section */}
                  <Card className="border border-pink-100/20">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-violet-800">
                        Family & Friends
                      </CardTitle>
                      <CardDescription>
                        Family background and social relationships
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label
                            htmlFor="parentsMaritalStatus"
                            className="text-slate-700"
                          >
                            Parents' marital status
                          </Label>
                          <Select
                            value={
                              formData.familyAndFriends.parentsMaritalStatus
                            }
                            onValueChange={(value) =>
                              handleChange(
                                "familyAndFriends",
                                "parentsMaritalStatus",
                                value
                              )
                            }
                          >
                            <SelectTrigger className="w-full border-slate-200">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="married">Married</SelectItem>
                              <SelectItem value="divorced">Divorced</SelectItem>
                              <SelectItem value="separated">
                                Separated
                              </SelectItem>
                              <SelectItem value="deceased">Deceased</SelectItem>
                              <SelectItem value="single">
                                Single parent
                              </SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <RatingInput
                          category="familyAndFriends"
                          field="solidFamilyBackground"
                          label="Solid family background"
                        />
                        <RatingInput
                          category="familyAndFriends"
                          field="familyValues"
                          label="Family values"
                        />
                        <RatingInput
                          category="familyAndFriends"
                          field="familyFunctioning"
                          label="Family functioning"
                        />
                        <RatingInput
                          category="familyAndFriends"
                          field="siblingRelationships"
                          label="Sibling relationships"
                        />
                        <RatingInput
                          category="familyAndFriends"
                          field="enjoyFamily"
                          label="You enjoy her family"
                        />
                        <RatingInput
                          category="familyAndFriends"
                          field="friendGroup"
                          label="Quality of friend group"
                        />
                        <RatingInput
                          category="familyAndFriends"
                          field="getsAlongWithYourFamily"
                          label="Gets along with your family"
                        />
                        <RatingInput
                          category="familyAndFriends"
                          field="getsAlongWithYourFriends"
                          label="Gets along with your friends"
                        />
                        <RatingInput
                          category="familyAndFriends"
                          field="possessive"
                          label="Possessive (higher = more issue)"
                        />

                        <div className="col-span-1 md:col-span-2 space-y-2">
                          <Label
                            htmlFor="familyNotes"
                            className="text-slate-700"
                          >
                            Notes on Family & Friends
                          </Label>
                          <Textarea
                            id="familyNotes"
                            value={formData.familyAndFriends.notes}
                            onChange={(e) =>
                              handleChange(
                                "familyAndFriends",
                                "notes",
                                e.target.value
                              )
                            }
                            className="min-h-[150px] border-slate-200"
                            placeholder="Observations about her family dynamics and social relationships..."
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Practical tab content */}
                <TabsContent value="practical" className="space-y-6">
                  {/* Business Partner */}
                  <Card className="border border-pink-100/20">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-violet-800">
                        Business Partner
                      </CardTitle>
                      <CardDescription>
                        Financial compatibility and work ethic
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <RatingInput
                          category="businessPartner"
                          field="saver"
                          label="Saver mindset"
                        />
                        <RatingInput
                          category="businessPartner"
                          field="wasteful"
                          label="Wasteful (higher = more issue)"
                        />
                        <RatingInput
                          category="businessPartner"
                          field="maintenance"
                          label="Low maintenance"
                        />
                        <RatingInput
                          category="businessPartner"
                          field="willingToSacrifice"
                          label="Willing to sacrifice"
                        />
                        <RatingInput
                          category="businessPartner"
                          field="riskTaker"
                          label="Risk taker"
                        />
                        <RatingInput
                          category="businessPartner"
                          field="financialResponsibility"
                          label="Financial responsibility"
                        />
                        <RatingInput
                          category="businessPartner"
                          field="selfStarter"
                          label="Self-starter"
                        />

                        <div className="space-y-2">
                          <Label htmlFor="debt" className="text-slate-700">
                            Debt situation
                          </Label>
                          <Input
                            id="debt"
                            value={formData.businessPartner.debt}
                            onChange={(e) =>
                              handleChange(
                                "businessPartner",
                                "debt",
                                e.target.value
                              )
                            }
                            className="border-slate-200"
                            placeholder="e.g., Student loans, credit card debt, mortgage, etc."
                          />
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-2">
                          <Label
                            htmlFor="businessNotes"
                            className="text-slate-700"
                          >
                            Notes on Business Compatibility
                          </Label>
                          <Textarea
                            id="businessNotes"
                            value={formData.businessPartner.notes}
                            onChange={(e) =>
                              handleChange(
                                "businessPartner",
                                "notes",
                                e.target.value
                              )
                            }
                            className="min-h-[150px] border-slate-200"
                            placeholder="Observations about financial compatibility and work ethic..."
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Roommate section */}
                  <Card className="border border-pink-100/20">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-violet-800">
                        Roommate Compatibility
                      </CardTitle>
                      <CardDescription>
                        Living habits and domestic compatibility
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <RatingInput
                          category="roommate"
                          field="tidiness"
                          label="Tidiness"
                        />
                        <RatingInput
                          category="roommate"
                          field="dishes"
                          label="Does dishes/cleans up"
                        />
                        <RatingInput
                          category="roommate"
                          field="personalSpace"
                          label="Respects personal space"
                        />
                        <RatingInput
                          category="roommate"
                          field="housekeeping"
                          label="Housekeeping skills"
                        />
                        <RatingInput
                          category="roommate"
                          field="sharesBurden"
                          label="Shares household burden"
                        />

                        <div className="col-span-1 md:col-span-2 space-y-2">
                          <Label
                            htmlFor="roommateNotes"
                            className="text-slate-700"
                          >
                            Notes on Roommate Compatibility
                          </Label>
                          <Textarea
                            id="roommateNotes"
                            value={formData.roommate.notes}
                            onChange={(e) =>
                              handleChange("roommate", "notes", e.target.value)
                            }
                            className="min-h-[150px] border-slate-200"
                            placeholder="Observations about domestic habits and living compatibility..."
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Overall Notes */}
                  <Card className="border border-pink-100/20">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-violet-800">
                        Overall Notes
                      </CardTitle>
                      <CardDescription>
                        Final thoughts and impressions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label
                          htmlFor="overallNotes"
                          className="text-slate-700"
                        >
                          Additional Thoughts
                        </Label>
                        <Textarea
                          id="overallNotes"
                          value={formData.overallNotes}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              overallNotes: e.target.value,
                            })
                          }
                          className="min-h-[200px] border-slate-200"
                          placeholder="Any additional thoughts or impressions about this person as a potential spouse..."
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Navigation and Submit Button */}
                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="text-slate-600 border-slate-200"
                    onClick={() => {
                      // Go back one tab unless we're on the first tab
                      if (activeTab === "faith") setActiveTab("basic");
                      else if (activeTab === "character") setActiveTab("faith");
                      else if (activeTab === "family")
                        setActiveTab("character");
                      else if (activeTab === "practical")
                        setActiveTab("family");
                    }}
                    disabled={activeTab === "basic" || isSubmitting}
                  >
                    Previous
                  </Button>

                  <Button
                    type="button"
                    className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white"
                    onClick={handleButtonClick}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Saving...
                      </>
                    ) : activeTab === "practical" ? (
                      <>
                        <HeartIcon className="h-4 w-4 mr-2" />
                        Save Consideration
                      </>
                    ) : (
                      "Continue to Next Section"
                    )}
                  </Button>
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <footer className="mt-16 text-center text-sm text-slate-500">
          <p>Your private space for meaningful reflections on marriage</p>
        </footer>
      </div>
    </div>
  );
}
