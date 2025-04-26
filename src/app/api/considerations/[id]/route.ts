import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the consideration ID from the route params
    const id = params.id;

    // Get the email from query params for authorization
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: "Valid consideration ID is required" },
        { status: 400 }
      );
    }

    // Query the specific consideration and check if it belongs to the requesting user
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
      WHERE c.id = $1 AND c.author_email = $2
      `,
      [id, email]
    );

    // If no matching consideration was found
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Consideration not found" },
        { status: 404 }
      );
    }

    // Return the found consideration
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching consideration:", error);
    return NextResponse.json(
      { error: "Failed to fetch consideration details" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { email } = body;

    // Validate inputs
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: "Valid consideration ID is required" },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required for authentication" },
        { status: 400 }
      );
    }

    // Begin transaction
    await query("BEGIN", []);

    try {
      // First verify the consideration belongs to this user
      const checkResult = await query(
        "SELECT id FROM considerations WHERE id = $1 AND author_email = $2",
        [id, email]
      );

      if (checkResult.rows.length === 0) {
        await query("ROLLBACK", []);
        return NextResponse.json(
          {
            error:
              "Consideration not found or you don't have permission to delete it",
          },
          { status: 404 }
        );
      }

      // Delete all related assessment records first (assuming foreign key constraints)
      await query("DELETE FROM faith_assessments WHERE consideration_id = $1", [
        id,
      ]);
      await query(
        "DELETE FROM character_assessments WHERE consideration_id = $1",
        [id]
      );
      await query(
        "DELETE FROM children_assessments WHERE consideration_id = $1",
        [id]
      );
      await query(
        "DELETE FROM friendship_assessments WHERE consideration_id = $1",
        [id]
      );
      await query(
        "DELETE FROM family_assessments WHERE consideration_id = $1",
        [id]
      );
      await query(
        "DELETE FROM business_assessments WHERE consideration_id = $1",
        [id]
      );
      await query(
        "DELETE FROM roommate_assessments WHERE consideration_id = $1",
        [id]
      );
      await query(
        "DELETE FROM physical_assessments WHERE consideration_id = $1",
        [id]
      );

      // Finally delete the consideration record itself
      await query("DELETE FROM considerations WHERE id = $1", [id]);

      // Commit the transaction
      await query("COMMIT", []);

      return NextResponse.json({
        success: true,
        message: "Consideration deleted successfully",
      });
    } catch (error) {
      // Rollback in case of error
      await query("ROLLBACK", []);
      throw error;
    }
  } catch (error) {
    console.error("Error deleting consideration:", error);
    return NextResponse.json(
      { error: "Failed to delete consideration" },
      { status: 500 }
    );
  }
}
