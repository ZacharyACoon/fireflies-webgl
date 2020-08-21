

// yields existing resources and generates more if needed
export default class ResourceTracker {
    constructor() {
        this.existing_resources = [];
    }

    track(resource) {
        this.existing_resources.push(resource);
        return resource;
    }

    * yieldResources(factory=undefined) {
        yield* this.existing_resources;
        if( factory !== undefined ) {
            while( true ) {
                yield this.track(factory());
            }
        }
    }

    dispose() {
        this.existing_resources = []
        // this.existing_resources = this.existing_resources.map(i => i.dispose());
    }
}
