import { SUPABASE_CLIENT } from "@/supabaseconfig";
import { SupabaseClient } from "@supabase/supabase-js";
import { User } from "./type/user";
import { USER_TABLE } from "./constants";

// All operations here are rendered on the server side
// DON'T CALL FROM ANY FRONT FACING COMPONENT
export class SupabaseService {
    private static instance: SupabaseService;
    private client: Promise<SupabaseClient>;

    private constructor() {
        this.client = SUPABASE_CLIENT;
    }

    public static getInstance(): SupabaseService {
        if (!SupabaseService.instance) {
            SupabaseService.instance = new SupabaseService();
        }
        return SupabaseService.instance;
    }

    public async createUser(user: User) {
        try {
            const { data, error } = await (await this.client)
                .from(USER_TABLE)
                .insert([user]);

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error("Error saving donation to DB:", error);
            throw error;
        }
    }
}
