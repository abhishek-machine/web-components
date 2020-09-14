import { h, Component, State, Element, Prop, Watch, Listen } from "@stencil/core";
import {AV_API_KEY } from "../../global/global";

@Component({
    tag: 'stock-price',
    styleUrl: './stock-price.css',
    shadow: true
})
export class StockPrice{
    stockInput: HTMLInputElement;
    // initialStockSymbol: string;

    @Element() el: HTMLElement;
    @State() fetchedPrice: number;
    @State() stockUserInput: string;
    @State() stockInputValid = false;
    @State() error: string;
    @State() loading = false;

    @Prop({mutable: true, reflect: true}) stockSymbol: string;

    @Watch('stockSymbol')
    stockSymbolChanged(newValue: string, oldValue: string) {
        if(newValue !== oldValue) {
            this.stockUserInput = newValue;
            this.stockInputValid = true;
            this.fetchStockPrice(newValue);
        }
    }

    onUserInput(event: Event) {
        this.stockUserInput = (event.target as HTMLInputElement).value;
        if(this.stockUserInput.trim() !== '') {
            this.stockInputValid = true;
        } else {
            this.stockInputValid = false;
        }
    }

    onFetchStockPrice(event: Event) {

        event.preventDefault();
        // const stockSymbol = (this.el.shadowRoot.querySelector('#stock-symbol') as HTMLInputElement).value;
        this.stockSymbol = this.stockInput.value;
        // this.fetchStockPrice(stockSymbol);
        
    }

    fetchStockPrice(stockSymbol) {
        this.loading = true;
        fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`)
            .then(response => {
                return response.json();
            })
            .then(parsedResponse => {
                this.loading = false;
                if(!parsedResponse['Global Quote']['05. price']) {
                    throw new Error('Invalid Symbol!');
                }
                this.error = null;
                this.fetchedPrice = +parsedResponse['Global Quote']['05. price'];
            })
            .catch(error => {
                this.loading = false;
                this.error = error.message;
                this.fetchedPrice = null;
            });
    }

    @Listen('body:sfSymbolSelected')
    onStockSymbolSelected(event: CustomEvent) {
        console.log('stock symbol selected' + event.detail);
        if(event.detail && event.detail !== this.stockSymbol) {
            this.stockSymbol = event.detail;            
        }
    }

    componentWillLoad() {
        console.log('component Will load');
        console.log(this.stockSymbol);

    }

    componentDidLoad() {
        console.log('component Did load');
        if(this.stockSymbol) {
            // this.initialStockSymbol = this.stockSymbol;
            this.stockUserInput = this.stockSymbol;
            this.stockInputValid = true;
            this.fetchStockPrice(this.stockSymbol);
        }
    }

    componentWillUpdate() {
        console.log('component Will update');
    }

    componentDidUpdate() {
        console.log('component did update');
        // if(this.stockSymbol !== this.initialStockSymbol) {
        //     this.initialStockSymbol = this.stockSymbol;
        //     this.fetchStockPrice(this.stockSymbol);
        // }
    }

    disconnectedCallback() {
        console.log('component did disconnect');
    }

    hostData() {
        return { class: this.error ? 'error' : '' };
    }

    render() {
        let dataContent = <p>Please enter a symbol!</p>;;
        if(this.error) {
            dataContent = <p>{this.error}</p>;
        }
        if(this.fetchedPrice) {
            dataContent = <p>Price: ${this.fetchedPrice}</p>;
        }
        if(this.loading) {
            dataContent = <stock-spinner></stock-spinner>;
        }
        return [
            <form onSubmit={this.onFetchStockPrice.bind(this)}>
                <input 
                    id="stock-symbol" 
                    ref={el => this.stockInput = el} 
                    value={this.stockUserInput}
                    onInput={this.onUserInput.bind(this)}
                />
                <button type="submit" disabled={!this.stockInputValid || this.loading}>Fetch</button>
            </form>,
            <div>
                {dataContent}
            </div>
        ];
    }
}