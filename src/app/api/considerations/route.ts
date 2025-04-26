import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { ConsiderationFormData } from "@/lib/types/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { authorEmail, ...data } = body as ConsiderationFormData & {
      authorEmail: string | null;
    };

    // Validate required data
    if (!authorEmail) {
      return NextResponse.json(
        { error: "User authentication required" },
        { status: 401 }
      );
    }

    if (!data.basicInfo.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Begin transaction
    await query("BEGIN", []);

    try {
      // 1. Insert consideration record
      const considerationResult = await query(
        `INSERT INTO considerations 
        (name, age, date_met, overall_notes, author_email) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id`,
        [
          data.basicInfo.name,
          data.basicInfo.age ? parseInt(data.basicInfo.age) : null,
          data.basicInfo.dateMet || null,
          data.overallNotes,
          authorEmail,
        ]
      );

      const considerationId = considerationResult.rows[0].id;

      // 2. Insert faith assessment
      await query(
        `INSERT INTO faith_assessments
        (consideration_id, is_catholic, practices_faith, shared_moral_values, helps_get_to_heaven, notes)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          considerationId,
          data.faith.isCatholic,
          data.faith.practicesFaith,
          data.faith.sharedMoralValues,
          data.faith.helpsGetToHeaven,
          data.faith.notes,
        ]
      );

      // 3. Insert character assessment
      await query(
        `INSERT INTO character_assessments
        (consideration_id, friendly, happy, polite, proud, discretion, charitable, humble, kind,
        positive_attitude, courageous, self_effacing, traditional_values, political_alignment, dating_history, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [
          considerationId,
          data.character.friendly,
          data.character.happy,
          data.character.polite,
          data.character.proud,
          data.character.discretion,
          data.character.charitable,
          data.character.humble,
          data.character.kind,
          data.character.positiveAttitude,
          data.character.courageous,
          data.character.selfEffacing,
          data.character.traditionalValues,
          data.character.politicalAlignment,
          data.character.datingHistory,
          data.character.notes,
        ]
      );

      // 4. Insert children assessment
      await query(
        `INSERT INTO children_assessments
        (consideration_id, wants_children, number_of_children, will_raise_catholic, 
        likes_children, children_gravitate, nurturing, excited_about_babies, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          considerationId,
          data.children.wantsChildren,
          data.children.numberOfChildren,
          data.children.willRaiseCatholic,
          data.children.likesChildren,
          data.children.childrenGravitate,
          data.children.nurturing,
          data.children.excitedAboutBabies,
          data.children.notes,
        ]
      );

      // 5. Insert friendship assessment
      await query(
        `INSERT INTO friendship_assessments
        (consideration_id, fun, shared_interests, adventurous, outdoorsy, curious, creative, 
        conversation, communication, conflict_resolution, unselfish, enjoyable_company, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          considerationId,
          data.friendship.fun,
          data.friendship.sharedInterests,
          data.friendship.adventurous,
          data.friendship.outdoorsy,
          data.friendship.curious,
          data.friendship.creative,
          data.friendship.conversation,
          data.friendship.communication,
          data.friendship.conflictResolution,
          data.friendship.unselfish,
          data.friendship.enjoyableCompany,
          data.friendship.notes,
        ]
      );

      // 6. Insert family assessment
      await query(
        `INSERT INTO family_assessments
        (consideration_id, solid_family_background, parents_marital_status, family_values, family_functioning, 
        sibling_relationships, enjoy_family, friend_group, gets_along_with_your_family, 
        gets_along_with_your_friends, possessive, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          considerationId,
          data.familyAndFriends.solidFamilyBackground,
          data.familyAndFriends.parentsMaritalStatus,
          data.familyAndFriends.familyValues,
          data.familyAndFriends.familyFunctioning,
          data.familyAndFriends.siblingRelationships,
          data.familyAndFriends.enjoyFamily,
          data.familyAndFriends.friendGroup,
          data.familyAndFriends.getsAlongWithYourFamily,
          data.familyAndFriends.getsAlongWithYourFriends,
          data.familyAndFriends.possessive,
          data.familyAndFriends.notes,
        ]
      );

      // 7. Insert business assessment
      await query(
        `INSERT INTO business_assessments
        (consideration_id, saver, wasteful, maintenance, willing_to_sacrifice, risk_taker, 
        debt, financial_responsibility, self_starter, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          considerationId,
          data.businessPartner.saver,
          data.businessPartner.wasteful,
          data.businessPartner.maintenance,
          data.businessPartner.willingToSacrifice,
          data.businessPartner.riskTaker,
          data.businessPartner.debt,
          data.businessPartner.financialResponsibility,
          data.businessPartner.selfStarter,
          data.businessPartner.notes,
        ]
      );

      // 8. Insert roommate assessment
      await query(
        `INSERT INTO roommate_assessments
        (consideration_id, tidiness, dishes, personal_space, housekeeping, shares_burden, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          considerationId,
          data.roommate.tidiness,
          data.roommate.dishes,
          data.roommate.personalSpace,
          data.roommate.housekeeping,
          data.roommate.sharesBurden,
          data.roommate.notes,
        ]
      );

      // 9. Insert physical assessment
      await query(
        `INSERT INTO physical_assessments
        (consideration_id, attraction, fitness, health_conscious, hygiene, family_longevity, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          considerationId,
          data.physicalAttraction.attraction,
          data.physicalAttraction.fitness,
          data.physicalAttraction.healthConscious,
          data.physicalAttraction.hygiene,
          data.physicalAttraction.familyLongevity,
          data.physicalAttraction.notes,
        ]
      );

      // Commit the transaction
      await query("COMMIT", []);

      return NextResponse.json({
        success: true,
        message: "Consideration saved successfully",
        id: considerationId,
      });
    } catch (error) {
      // Rollback transaction in case of error
      await query("ROLLBACK", []);
      console.error("Database transaction error:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error saving consideration:", error);
    return NextResponse.json(
      { error: "Failed to save consideration" },
      { status: 500 }
    );
  }
}

// Add this GET function to your existing route.ts file
export async function GET(request: NextRequest) {
  try {
    // Get the email from query params
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    // Query considerations and all related assessment data
    const result = await query(
      `
      SELECT 
        c.id,
        c.name,
        c.age,
        c.date_met,
        c.overall_notes,
        c.created_at,
        c.updated_at,
        
        -- Faith Assessment
        json_build_object(
          'is_catholic', f.is_catholic,
          'practices_faith', f.practices_faith,
          'shared_moral_values', f.shared_moral_values,
          'helps_get_to_heaven', f.helps_get_to_heaven,
          'notes', f.notes
        ) AS faith_assessment,
        
        -- Character Assessment
        json_build_object(
          'friendly', ch.friendly,
          'happy', ch.happy,
          'polite', ch.polite,
          'proud', ch.proud,
          'discretion', ch.discretion,
          'charitable', ch.charitable,
          'humble', ch.humble,
          'kind', ch.kind,
          'positive_attitude', ch.positive_attitude,
          'courageous', ch.courageous,
          'self_effacing', ch.self_effacing,
          'dating_history', ch.dating_history,
          'traditional_values', ch.traditional_values,
          'political_alignment', ch.political_alignment,
          'notes', ch.notes
        ) AS character_assessment,
        
        -- Children Assessment
        json_build_object(
          'wants_children', chi.wants_children,
          'number_of_children', chi.number_of_children,
          'will_raise_catholic', chi.will_raise_catholic,
          'likes_children', chi.likes_children,
          'children_gravitate', chi.children_gravitate,
          'nurturing', chi.nurturing,
          'excited_about_babies', chi.excited_about_babies,
          'notes', chi.notes
        ) AS children_assessment,
        
        -- Friendship Assessment
        json_build_object(
          'fun', fr.fun,
          'shared_interests', fr.shared_interests,
          'adventurous', fr.adventurous, 
          'outdoorsy', fr.outdoorsy,
          'curious', fr.curious,
          'creative', fr.creative,
          'conversation', fr.conversation,
          'communication', fr.communication,
          'conflict_resolution', fr.conflict_resolution,
          'unselfish', fr.unselfish,
          'enjoyable_company', fr.enjoyable_company,
          'notes', fr.notes
        ) AS friendship_assessment,
        
        -- Family Assessment
        json_build_object(
          'solid_family_background', fa.solid_family_background,
          'parents_marital_status', fa.parents_marital_status,
          'family_values', fa.family_values,
          'family_functioning', fa.family_functioning,
          'sibling_relationships', fa.sibling_relationships,
          'enjoy_family', fa.enjoy_family,
          'friend_group', fa.friend_group,
          'gets_along_with_your_family', fa.gets_along_with_your_family,
          'gets_along_with_your_friends', fa.gets_along_with_your_friends,
          'possessive', fa.possessive,
          'notes', fa.notes
        ) AS family_assessment,
        
        -- Business Assessment
        json_build_object(
          'saver', b.saver,
          'wasteful', b.wasteful,
          'maintenance', b.maintenance,
          'willing_to_sacrifice', b.willing_to_sacrifice,
          'risk_taker', b.risk_taker,
          'debt', b.debt,
          'financial_responsibility', b.financial_responsibility,
          'self_starter', b.self_starter,
          'notes', b.notes
        ) AS business_assessment,
        
        -- Roommate Assessment
        json_build_object(
          'tidiness', r.tidiness,
          'dishes', r.dishes,
          'personal_space', r.personal_space,
          'housekeeping', r.housekeeping,
          'shares_burden', r.shares_burden,
          'notes', r.notes
        ) AS roommate_assessment,
        
        -- Physical Assessment
        json_build_object(
          'attraction', p.attraction,
          'fitness', p.fitness,
          'health_conscious', p.health_conscious,
          'hygiene', p.hygiene,
          'family_longevity', p.family_longevity,
          'notes', p.notes
        ) AS physical_assessment
        
      FROM considerations c
      LEFT JOIN faith_assessments f ON c.id = f.consideration_id
      LEFT JOIN character_assessments ch ON c.id = ch.consideration_id
      LEFT JOIN children_assessments chi ON c.id = chi.consideration_id
      LEFT JOIN friendship_assessments fr ON c.id = fr.consideration_id
      LEFT JOIN family_assessments fa ON c.id = fa.consideration_id
      LEFT JOIN business_assessments b ON c.id = b.consideration_id
      LEFT JOIN roommate_assessments r ON c.id = r.consideration_id
      LEFT JOIN physical_assessments p ON c.id = p.consideration_id
      WHERE c.author_email = $1
      ORDER BY c.created_at DESC
      `,
      [email]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching considerations:", error);
    return NextResponse.json(
      { error: "Failed to fetch considerations" },
      { status: 500 }
    );
  }
}
