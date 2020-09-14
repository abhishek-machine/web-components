import { Component, State, Event, EventEmitter } from "@stencil/core";

import { h } from "@stencil/core";
import { AV_API_KEY } from "../../global/global";

@Component({
    tag: 'stock-finder',
    styleUrl: './stock-finder.css',
    shadow: true
})
export class StockFinder {
    stockNameInput: HTMLInputElement;

    @State() searchResults: {symbol: string, name: string}[] = [];
    @State() loading = false;

    @Event({ bubbles: true, composed: true}) sfSymbolSelected: EventEmitter<string>;

    onFindStocks(event: Event) {
        event.preventDefault();
        this.loading = true;
        const stockName = this.stockNameInput.value;
        fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockName}&apikey=${AV_API_KEY}`)
            .then(response => response.json())
            .then(parsedResponse => {
                this.loading = false;
                this.searchResults = parsedResponse['bestMatches'].map(match => {
                    return {
                        name: match["2. name"],
                        symbol: match["1. symbol"]
                    }
                })
            })
            .catch(error => {
                this.loading = false;
                console.log(error);
            })
    }

    onSelectSymbol(symbol: string) {
        this.sfSymbolSelected.emit(symbol);
    }

    render() {
        let content;
        
        if(this.loading) {
            content = <stock-spinner></stock-spinner>
        }
        
        content = <ul>
            {this.searchResults.map(result => (
                <li onClick={this.onSelectSymbol.bind(this, result.symbol)}>
                <strong>{result.symbol}</strong> - {result.name}</li>
            )
        )}</ul>;

        return [
            <form onSubmit={this.onFindStocks.bind(this)}>
                <input id="stock-symbol" ref={el => this.stockNameInput = el} />
                <button type="submit">Find!</button>
            </form>,
            content
        ]
    }
}