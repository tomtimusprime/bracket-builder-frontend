const API_BASE_URL = "http://localhost:3000/api";

export interface ItemResponse {
  id: string;
  name: string;
  seed: number;
  eliminated: boolean;
}

export interface MatchResponse {
  id: string;
  round: number;
  match_number: number;
  item1: ItemResponse | null;
  item2: ItemResponse | null;
  winner_id: string | null;
}

export interface BracketResponse {
  id: string;
  name: string;
  topic: string;
  status: string;
  total_rounds: number;
  items: ItemResponse[];
  matches: MatchResponse[];
}

export interface Bracket {
  id: string;
  name: string;
  topic: string;
  created_at: string;
  updated_at: string;
  status: string;
  total_rounds: number;
}

export interface CreateBracketRequest {
  name: string;
  topic: string;
  items: string[];
}

export interface UpdateMatchRequest {
  winner_id: string;
}

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      } catch (e) {
        // If we can't read the error text, use the status
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }
    throw new Error(`Network error: ${String(e)}`);
  }
}

export const api = {
  createBracket: (data: CreateBracketRequest): Promise<BracketResponse> =>
    fetchAPI("/brackets", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getBracket: (id: string): Promise<BracketResponse> =>
    fetchAPI(`/brackets/${id}`),

  listBrackets: (): Promise<Bracket[]> => fetchAPI("/brackets"),

  updateMatch: (
    bracketId: string,
    matchId: string,
    data: UpdateMatchRequest
  ): Promise<BracketResponse> =>
    fetchAPI(`/brackets/${bracketId}/matches/${matchId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  resetBracket: (id: string): Promise<BracketResponse> =>
    fetchAPI(`/brackets/${id}/reset`, {
      method: "DELETE",
    }),

  deleteBracket: (id: string): Promise<{ success: boolean; message: string }> =>
    fetchAPI(`/brackets/${id}`, {
      method: "DELETE",
    }),

  clearMatchWinner: (
    bracketId: string,
    matchId: string
  ): Promise<BracketResponse> =>
    fetchAPI(`/brackets/${bracketId}/matches/${matchId}/clear`, {
      method: "DELETE",
    }),
};
