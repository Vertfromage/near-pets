import { NearBindgen, near, call, view, initialize, UnorderedMap } from 'near-sdk-js';

@NearBindgen({})
class PetNames {
  
  
  beneficiary: string = "testyturtle.testnet";	
  pets: UnorderedMap = new UnorderedMap('map-uid-1');

  @initialize
  init({ beneficiary }:{beneficiary: string}) {
    near.log(`${beneficiary} gets all the near!`);
    this.beneficiary = beneficiary
  }

  @view
  get_beneficiary(){ return this.beneficiary }

  @call 
  set_pet_name({ pet_id, pet_name }:{ pet_id: string ,pet_name: string }): void {
    make_private();
    this.pets.set(pet_id, pet_name)
    near.log(`Thank you for giving ${pet_id} the name ${pet_name}, you have changed the name for all users!`);
  }

  @call 
  change_pet_name({ pet_id, pet_name }:{ pet_id: string ,pet_name: string }): void {
    let account = near.predecessorAccountId(); 
    let donationAmount: bigint = near.attachedDeposit() as bigint;
    
    // Record a log permanently to the blockchain!
    near.log(`${account} is attempting to set ${pet_id} name to ${pet_name}`);
  
    assert(donationAmount > STORAGE_COST, `Attach at least ${STORAGE_COST} yoctoNEAR`);
    assert(this.pets.get(pet_id) !== null,'Not valid pet_id')

    let toTransfer = donationAmount-STORAGE_COST;
    this.pets.set(pet_id, pet_name)
    near.log(`Thank you ${account} for giving ${pet_id} the name ${pet_name}, you have changed the name for all users!`);
  
    // Send the money to the beneficiary
    const promise = near.promiseBatchCreate(this.beneficiary)
    near.promiseBatchActionTransfer(promise, toTransfer)
  }

  @view
  get_pet_name({ pet_id }: { pet_id: string }): string {
    return this.pets.get(pet_id) as string
  }

  @view
  number_of_pets() { return this.pets.length }

  @view
  get_all_pets() { return this.pets.toArray()}

}

const STORAGE_COST: bigint = BigInt("1000000000000000000000")

function assert(statement, message) {
  if (!statement) {
    throw Error(`Assertion failed: ${message}`)
  }
}

export function make_private(){
  assert(near.predecessorAccountId() == near.currentAccountId(), "This is a private method")
}
