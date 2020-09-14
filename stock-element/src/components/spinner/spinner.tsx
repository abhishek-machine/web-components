import { h, Component } from "@stencil/core";

@Component({
    tag: 'stock-spinner',
    styleUrl: './spinner.css',
    shadow: true
})

export class Spinner {
    render() {
        return (
            <div class="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        );
    }
}