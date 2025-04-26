export interface User {
  // I had to make this mimic the User type from next-auth to get the types to work correctly
  id?: string | undefined;
  email?: string | null | undefined; // "thomas.marconi2@gmail.com"
  image?: string | null | undefined; // "https://lh3.googleusercontent.com/a/ACg8ocIjHTlknqx2fiIZ-FstdIsdzU39i12pf3MJYduZx46qwlpJgm0h=s96-c"
  name?: string | null | undefined; // "Thomas Marconi"
}

export type Rating = 1 | 2 | 3 | 4 | 5;

export interface ConsiderationFaith {
  isCatholic: boolean;
  practicesFaith: Rating;
  sharedMoralValues: Rating;
  helpsGetToHeaven: Rating;
  notes: string;
}

export interface ConsiderationCharacter {
  friendly: Rating;
  happy: Rating;
  polite: Rating;
  proud: Rating;
  discretion: Rating;
  charitable: Rating;
  humble: Rating;
  kind: Rating;
  positiveAttitude: Rating;
  courageous: Rating;
  selfEffacing: Rating;
  datingHistory: string;
  traditionalValues: Rating;
  politicalAlignment: Rating;
  notes: string;
}

export interface ConsiderationChildren {
  wantsChildren: boolean;
  numberOfChildren: string;
  willRaiseCatholic: boolean;
  likesChildren: Rating;
  childrenGravitate: Rating;
  nurturing: Rating;
  excitedAboutBabies: Rating;
  notes: string;
}

export interface ConsiderationFriendship {
  fun: Rating;
  sharedInterests: Rating;
  adventurous: Rating;
  outdoorsy: Rating;
  curious: Rating;
  creative: Rating;
  conversation: Rating;
  communication: Rating;
  conflictResolution: Rating;
  unselfish: Rating;
  enjoyableCompany: Rating;
  notes: string;
}

export interface ConsiderationFamilyAndFriends {
  solidFamilyBackground: Rating;
  parentsMaritalStatus: string;
  familyValues: Rating;
  familyFunctioning: Rating;
  siblingRelationships: Rating;
  enjoyFamily: Rating;
  friendGroup: Rating;
  getsAlongWithYourFamily: Rating;
  getsAlongWithYourFriends: Rating;
  possessive: Rating;
  notes: string;
}

export interface ConsiderationBusinessPartner {
  saver: Rating;
  wasteful: Rating;
  maintenance: Rating;
  willingToSacrifice: Rating;
  riskTaker: Rating;
  debt: string;
  financialResponsibility: Rating;
  selfStarter: Rating;
  notes: string;
}

export interface ConsiderationRoommate {
  tidiness: Rating;
  dishes: Rating;
  personalSpace: Rating;
  housekeeping: Rating;
  sharesBurden: Rating;
  notes: string;
}

export interface ConsiderationPhysicalAttraction {
  attraction: Rating;
  fitness: Rating;
  healthConscious: Rating;
  hygiene: Rating;
  familyLongevity: Rating;
  notes: string;
}

export interface ConsiderationBasicInfo {
  name: string;
  age: string;
  dateMet: string;
}
export interface ConsiderationFormData {
  basicInfo: ConsiderationBasicInfo;
  faith: ConsiderationFaith;
  character: ConsiderationCharacter;
  children: ConsiderationChildren;
  friendship: ConsiderationFriendship;
  familyAndFriends: ConsiderationFamilyAndFriends;
  businessPartner: ConsiderationBusinessPartner;
  roommate: ConsiderationRoommate;
  physicalAttraction: ConsiderationPhysicalAttraction;
  overallNotes: string;
}

export interface ConsiderationRecord {
  id: number;
  name: string;
  age: number | null;
  date_met: string | null;
  created_at: string;
  updated_at: string;
  overall_notes: string | null;
  faith_assessment: {
    is_catholic: boolean;
    practices_faith: Rating;
    shared_moral_values: Rating;
    helps_get_to_heaven: Rating;
    notes: string;
  };
  character_assessment: {
    friendly: Rating;
    happy: Rating;
    polite: Rating;
    proud: Rating;
    discretion: Rating;
    charitable: Rating;
    humble: Rating;
    kind: Rating;
    positive_attitude: Rating;
    courageous: Rating;
    self_effacing: Rating;
    dating_history: string;
    traditional_values: Rating;
    political_alignment: Rating;
    notes: string;
  };
  children_assessment: {
    wants_children: boolean;
    number_of_children: string;
    will_raise_catholic: boolean;
    likes_children: Rating;
    children_gravitate: Rating;
    nurturing: Rating;
    excited_about_babies: Rating;
    notes: string;
  };
  friendship_assessment: {
    fun: Rating;
    shared_interests: Rating;
    adventurous: Rating;
    outdoorsy: Rating;
    curious: Rating;
    creative: Rating;
    conversation: Rating;
    communication: Rating;
    conflict_resolution: Rating;
    unselfish: Rating;
    enjoyable_company: Rating;
    notes: string;
  };
  family_assessment: {
    solid_family_background: Rating;
    parents_marital_status: string;
    family_values: Rating;
    family_functioning: Rating;
    sibling_relationships: Rating;
    enjoy_family: Rating;
    friend_group: Rating;
    gets_along_with_your_family: Rating;
    gets_along_with_your_friends: Rating;
    possessive: Rating;
    notes: string;
  };
  business_assessment: {
    saver: Rating;
    wasteful: Rating;
    maintenance: Rating;
    willing_to_sacrifice: Rating;
    risk_taker: Rating;
    debt: string;
    financial_responsibility: Rating;
    self_starter: Rating;
    notes: string;
  };
  roommate_assessment: {
    tidiness: Rating;
    dishes: Rating;
    personal_space: Rating;
    housekeeping: Rating;
    shares_burden: Rating;
    notes: string;
  };
  physical_assessment: {
    attraction: Rating;
    fitness: Rating;
    health_conscious: Rating;
    hygiene: Rating;
    family_longevity: Rating;
    notes: string;
  };
}
