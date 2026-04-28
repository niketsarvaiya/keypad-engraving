import type { EngravingProject, BOQProject, BOQChange, BOQSnapshot } from '../types';

export function buildSnapshot(boq: BOQProject): BOQSnapshot {
  const KEYPAD_WORDS = ['keypad', 'key pad', 'push button'];
  const keypadsForRoom = (roomId: string) =>
    boq.lineItems
      .filter(i => i.included && KEYPAD_WORDS.some(w => `${i.product} ${i.scope}`.toLowerCase().includes(w)))
      .flatMap(i =>
        i.roomAllocations
          .filter(a => a.roomId === roomId && a.qty > 0)
          .map(a => ({ name: i.product, qty: a.qty, modelNumber: i.modelNumber }))
      );

  return {
    snapshotDate: new Date().toISOString(),
    rooms: boq.rooms.map(r => ({ id: r.id, name: r.name, keypads: keypadsForRoom(r.id) })),
  };
}

export function computeChanges(project: EngravingProject, snapshot: BOQSnapshot): BOQChange[] {
  const changes: BOQChange[] = [];

  // Rooms in BOQ but not in project → added (needs to be added to project)
  for (const sRoom of snapshot.rooms) {
    const pRoom = project.rooms.find(r => r.name.toLowerCase() === sRoom.name.toLowerCase());
    if (!pRoom) {
      changes.push({ type: 'added', entity: 'room', roomId: sRoom.id, roomName: sRoom.name });
      continue;
    }
    // Keypads in BOQ room vs project room
    const boqTotal = sRoom.keypads.reduce((s, k) => s + k.qty, 0);
    const projTotal = pRoom.keypads.reduce((s, k) => s + k.quantity, 0);
    if (boqTotal !== projTotal) {
      changes.push({ type: 'count-changed', entity: 'keypad', roomId: pRoom.id, roomName: pRoom.name, boqQty: boqTotal, projectQty: projTotal });
    }
  }

  // Rooms in project but not in BOQ snapshot → may have been removed from BOQ
  for (const pRoom of project.rooms) {
    const inSnapshot = snapshot.rooms.find(r => r.name.toLowerCase() === pRoom.name.toLowerCase());
    if (!inSnapshot) {
      changes.push({ type: 'removed', entity: 'room', roomId: pRoom.id, roomName: pRoom.name });
    }
  }

  return changes;
}
