import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-recall',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './add-recall.component.html'
})
export class AddRecallComponent implements OnInit {
  recall: any = {
    year: '',
    halfyear: '',
    month: '',
    day: '',
    prue_number: '',
    prue_freigabe: '',
    art: '',
    artdate: '',
    pi_income_date: '',
    type: '',
    is_marke: false,
    artikelanzahl_prue: '',
    kassasperre: '',
    createkundeninfo: '',
    meldung: false,
    meldung_date: '',
    cm: '',
    qm: '',
    bm: '',
    pm: '',
    bearbeitung_beginn: '',
    bearbeitung_ende: '',
    artsperr: '',
    anzahl_artsperr: '',
    formular: false,
    mandatar: '',
    note: '',
    cause_id: '',
    product_id: '',
    lieferant_id: '',
    produzent_id: '',
    version_id: '',
    rechnung_name: '',
    rechnung_betrag: '',
    rechnung_sprache: '',
    rechnung_ver_betrag: '',
    rechnung_kontrolle: ''
  };

  lieferanten: any[] = [];
  produkte: any[] = [];
  produzenten: any[] = [];
  ursachen: any[] = [];
  versionen: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<any[]>('/api/lieferanten').subscribe(data => this.lieferanten = data);
    this.http.get<any[]>('/api/produkte').subscribe(data => this.produkte = data);
    this.http.get<any[]>('/api/produzenten').subscribe(data => this.produzenten = data);
    this.http.get<any[]>('/api/ursachen').subscribe(data => this.ursachen = data);
    this.http.get<any[]>('/api/versionen').subscribe(data => this.versionen = data);
  }

  submitRecall(): void {
    this.http.post('/api/recalls', this.recall).subscribe(() => {
      alert('Rückruf erfolgreich hinzugefügt');
      this.router.navigate(['/']);
    });
  }
  selectedFile: File | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result as string);
          // Falls gewünscht: Automatisch das recall-Objekt befüllen
          this.recall = { ...this.recall, ...json };
        } catch (e) {
          alert('Ungültige JSON-Datei');
        }
      };
      reader.readAsText(this.selectedFile);
    }
  }

}
