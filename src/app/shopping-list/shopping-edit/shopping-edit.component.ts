import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,

} from '@angular/core';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForOf } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit,OnDestroy {
  editedIndex: number;
  editMode = false;
  editedIngredient:Ingredient;
  subscription:Subscription;
  @ViewChild('f')slForm:NgForm;
  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.slService.editIngredients.subscribe((index: number) => {
      this.editedIndex = index;
      this.editMode = true;
      this.editedIngredient = this.slService.getIngredient(index);
      // console.log(this.editedIngredient)
      this.slForm.setValue({
        'name':this.editedIngredient.name,
        'amount':this.editedIngredient.amount
      })
    })
  }

  onAddItem(form: NgForm) {
    const value = form.value;
    const ingName = value.name;
    const ingAmount = value.amount;
    const newIngredient = new Ingredient(ingName, ingAmount);
    if(this.editMode){
      this.slService.updateIngredient(this.editedIndex,newIngredient);
    }else{
    this.slService.addIngredient(newIngredient);
    }
    this.editMode =false;
    this.slForm.reset();
  }

  onClear(){
    this.slForm.reset();
    this.editMode = false;
  }
  onDelete(){
    this.slService.deleteIngredient(this.editedIndex);
  this.onClear();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
