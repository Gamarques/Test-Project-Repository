import './style.css'
import { webScrapper } from './search.js'


document.querySelector('#app').innerHTML = `
  <div id="container">
    <header class="header">
      <h1>A to Z finder</h1>
      <p class="subtitle">The easiest way to shop on amazon</p>
    </header>
    
    <main class="main-content">
      <section class="search-section">
        <div class="search-wrapper">
          <input 
            type="text" 
            id="keyword" 
            placeholder="Type the product name..." 
            class="search-input"
          />
          <button id="searchBtn" type="button" class="search-button">
            <span class="button-text">Search</span>
          </button>
        </div>
      </section>
    </main>
  </div>
`

webScrapper(document.querySelector('#app'));
