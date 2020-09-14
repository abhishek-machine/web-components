import { Component, Prop, State, Method } from "@stencil/core/internal";

import { h } from "@stencil/core";

@Component({
    tag: 'side-drawer',
    styleUrl: './side-drawer.css',
    shadow: true
})
export class SideDrawer {
    @State() showContactInfo =  false;
    @Prop({reflect: true}) title: string;
    @Prop({reflect: true, mutable: true}) opened: boolean;
    
    onCloseDrawer() {
        this.opened = false;
    }

    onContactChange(content: string) {
        this.showContactInfo = content === 'contact';

    }
   
    @Method()
    open() {
        this.opened = true;
    }

    render() {
        let  mainContent= <slot/>;
        if(this.showContactInfo) {
            mainContent = (
                <div id="contact-information">
                    <h2>Contact Information</h2>
                    <p>You can reach us via phone or email.</p>
                    <ul>
                        <li>Phone: 89797927849</li>
                        <li>Email: <a href="mailto:test@testmail.com">test@testmail.com</a></li>
                    </ul>
                </div>
            );
        }

        return [
            <div class="backdrop" onClick={this.onCloseDrawer.bind(this)}></div>,
            <aside>
                <header>
                    <h1>{this.title}</h1>
                    <button onClick={this.onCloseDrawer.bind(this)}>X</button>
                </header>
                <section id="tabs">
                    <button class={!this.showContactInfo ? "active" : ""} onClick={this.onContactChange.bind(this, 'nav')}>Navigation</button>
                    <button class={this.showContactInfo ? "active" : ""} onClick={this.onContactChange.bind(this, 'contact')}>Contact</button>
                </section>
                <main>
                    {mainContent}
                </main>
            </aside>
        ];
    }
}