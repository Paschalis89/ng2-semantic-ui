import {EventEmitter} from '@angular/core';

export type DropdownAutoCloseType = "itemClick" | "outsideClick" | "disabled";

// Creates essentially a 'string' enum.
export const DropdownAutoCloseType = {
    ItemClick: "itemClick" as DropdownAutoCloseType,
    OutsideClick: "outsideClick" as DropdownAutoCloseType,
    Disabled: "disabled" as DropdownAutoCloseType
}

export class DropdownService {
    // Open state of the dropdown
    public isOpen:boolean;
    // Emitter for when dropdown open state changes.
    public isOpenChange:EventEmitter<boolean>;

    public isDisabled:boolean;

    // Sets the "autoclose" mode of the dropdown - i.e. what user action causes it to autoclose.
    // Options are itemClick (close when choosing an item or clicking outside) [default], outsideClick (choose only when clicking outside) & disabled (never autoclose).
    public autoCloseMode:DropdownAutoCloseType;

    // Keep track of the containing dropdown so we can open it as necessary.
    public parent:DropdownService;
    // Also keep track of dropdowns nested in this one so we can close them as necessary.
    public children:DropdownService[];
    public get isNested() {
        return !!this.parent;
    }

    constructor() {
        this.isOpen = false;
        this.isOpenChange = new EventEmitter<boolean>();

        this.isDisabled = false;

        this.autoCloseMode = DropdownAutoCloseType.ItemClick;

        this.children = [];
    }

    public setOpenState(isOpen:boolean, reflectInParent:boolean = false) {
        if (this.isOpen != isOpen && !this.isDisabled) {
            // Only update the state if it has changed, and the dropdown isn't disabled.
            this.isOpen = !!isOpen;
            // We must delay the emitting to avoid the 'changed after checked' Angular errors.
            this.delay(() => this.isOpenChange.emit(this.isOpen));

            if (!this.isOpen) {
                // Close the child dropdowns when this one closes.
                this.children.forEach(c => c.setOpenState(this.isOpen));
            }

            if (this.parent && reflectInParent) {
                // Open the parent dropdowns when this one opens.
                this.parent.setOpenState(this.isOpen, true);
            }
        }
        else if (this.isOpen != isOpen && this.isDisabled) {
            // If the state has changed, but the dropdown is disabled, re-emit the original isOpen value.
            this.delay(() => this.isOpenChange.emit(this.isOpen));
        }
    }

    public setDisabledState(isDisabled:boolean) {
        if (this.isDisabled != isDisabled) {
            if (!!isDisabled) {
                // Close the dropdown as it is now disabled
                this.setOpenState(false);
            }

            this.isDisabled = !!isDisabled;
        }
    }

    public toggleOpenState() {
        this.setOpenState(!this.isOpen);
    }

    // Registers a dropdown service as a child of this service.
    public registerChild(child:DropdownService) {
        if (!this.isChildRegistered(child)) {
            this.children.push(child);
            child.parent = this;
        }
    }

    // Recursive method to check if the provided dropdown is already registered as a child, or is a descendant of a child.
    public isChildRegistered(child:DropdownService):boolean {
        return this === child || !!this.children
            .find(c => !!c.children
                .find(c => c.isChildRegistered(child)));
    }

    // Wipes any nested data, so all services can be cleanly reattached.
    public clearChildren() {
        this.children.forEach(c => {
            c.parent = null;
        });
        this.children = [];
    }

    // Method for delaying an event into the next tick, to avoid Angular "changed after checked" error.
    private delay(callback:() => any) {
        setTimeout(() => callback());
    }
}