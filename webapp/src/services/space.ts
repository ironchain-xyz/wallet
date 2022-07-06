import { Store } from 'vuex';
import { State } from "../store";

export interface SpaceBase {
    name: string;
    description: string;
}

export interface Space extends SpaceBase {
    id: string;
    createdAt: string;
    totalMembers: number;
    isMember: boolean;
}

export interface NewSpaceAlert {
    description?: string;
    save?: string;
}

export interface SpaceQuery {
    startAt?: string,
    offset: number,
    limit: number,
}

export function validateSpace(space: SpaceBase, alert: NewSpaceAlert): { alert?: NewSpaceAlert, ok: boolean } {
    let ok = true;
    if (!space.description) {
        alert.description = "Description cannot be empty";
        ok = false;
    }
    return { ok, alert };
}

export async function newSpace(store: Store<State>, space: SpaceBase): Promise<{id: number}> {
    return {id: 1};
}

const mockSpace = {
    id: "12345",
    name: "space",
    description: "a new space",
    createdAt: new Date().toString(),
    totalMembers: 89000000,
    isMember: true,
};

export async function fetchSpace(
    store: Store<State>,
    id: string
) : Promise<Space> {
    return mockSpace;
}

export async function fetchSpaces(
    store: Store<State>,
    params: SpaceQuery
) : Promise<Space[]> {
    return Array(20).fill([mockSpace, {...mockSpace, isMember: false}]).flat();
}

export async function joinSpace(
    store: Store<State>,
    id: string,
) : Promise<null> {
    return null;
}

export async function leaveSpace(
    store: Store<State>,
    id: string,
) : Promise<null> {
    return null;
}
