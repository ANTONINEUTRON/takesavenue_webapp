import { SUPABASE_CLIENT } from "@/supabaseconfig";
import { SupabaseClient } from "@supabase/supabase-js";
import { User } from "./type/user";
import { TAKE_TABLE, USER_TABLE } from "./constants";
import { Take } from "./type/take";

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

    public async signIn(userId: string): Promise<User | null> {
        try {
            const { data, error } = await (await this.client)
                .from(USER_TABLE)
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error("Error fetching user:", error);
                return null;
            }

            if (!data) {
                return null;
            }

            return data as User;
        } catch (error) {
            console.error("Error in signIn:", error);
            return null;
        }
    }

    //
    //Take
    public async createTake(take: Take) {
        try {
            console.log("Creating take:", take);
            const { data, error } = await (await this.client)
                .from(TAKE_TABLE)
                .insert([take]);

            if (error) {
                console.error("Error saving take to DBbb:", error);
                throw error;
            }

        } catch (error) {
            console.error("Error saving take to DB:", error);
            throw error;
        }
    }
}
