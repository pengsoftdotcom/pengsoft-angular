
import { Component, OnInit } from '@angular/core';
import { InputComponent } from '../input.component';

@Component({
    selector: 'app-input-number',
    templateUrl: './number.component.html',
    styleUrls: ['./number.component.scss']
})
export class NumberComponent extends InputComponent implements OnInit {

    MAX = 9223372036854775807;

    MIN = -9223372036854775808;

}
