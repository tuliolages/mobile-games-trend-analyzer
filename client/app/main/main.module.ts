import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';


import { RouterModule, Routes } from '@angular/router';

import { TooltipModule } from 'ngx-bootstrap';

import { MyDateRangePickerModule } from 'mydaterangepicker';

import { MainComponent } from './main.component';


export const ROUTES: Routes = [
    { path: 'home', component: MainComponent },
];


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forChild(ROUTES),


        TooltipModule.forRoot(),
        MyDateRangePickerModule
    ],
    declarations: [
        MainComponent,
    ],

    exports: [
        MainComponent,
    ],
})
export class MainModule {}
