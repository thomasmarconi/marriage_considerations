export interface User {
  // I had to make this mimic the User type from next-auth to get the types to work correctly
  id?: string | undefined;
  email?: string | null | undefined; // "thomas.marconi2@gmail.com"
  image?: string | null | undefined; // "https://lh3.googleusercontent.com/a/ACg8ocIjHTlknqx2fiIZ-FstdIsdzU39i12pf3MJYduZx46qwlpJgm0h=s96-c"
  name?: string | null | undefined; // "Thomas Marconi"
}

export type Rating = 1 | 2 | 3 | 4 | 5;

export interface ConsiderationFormData {
  basicInfo: {
    name: string;
    age: string;
    dateMet: string;
  };
  faith: {
    isCatholic: boolean;
    practicesFaith: Rating;
    sharedMoralValues: Rating;
    helpsGetToHeaven: Rating;
    notes: string;
  };
  character: {
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
  };
  children: {
    wantsChildren: boolean;
    numberOfChildren: string;
    willRaiseCatholic: boolean;
    likesChildren: Rating;
    childrenGravitate: Rating;
    nurturing: Rating;
    excitedAboutBabies: Rating;
    notes: string;
  };
  friendship: {
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
  };
  familyAndFriends: {
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
  };
  businessPartner: {
    saver: Rating;
    wasteful: Rating;
    maintenance: Rating;
    willingToSacrifice: Rating;
    riskTaker: Rating;
    debt: string;
    financialResponsibility: Rating;
    selfStarter: Rating;
    notes: string;
  };
  roommate: {
    tidiness: Rating;
    dishes: Rating;
    personalSpace: Rating;
    housekeeping: Rating;
    sharesBurden: Rating;
    notes: string;
  };
  physicalAttraction: {
    attraction: Rating;
    fitness: Rating;
    healthConscious: Rating;
    hygiene: Rating;
    familyLongevity: Rating;
    notes: string;
  };
  overallNotes: string;
}
