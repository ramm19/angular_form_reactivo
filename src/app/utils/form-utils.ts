import { AbstractControl, FormArray, FormGroup, ValidationErrors } from '@angular/forms';

async function sleep() {
  return new Promise( resolve => {
    setTimeout(() => {
      resolve(true)
    }, 2500);
  });
}

export class FormUtils {
  //expresiones regulares
  static namePattern = '^([a-zA-Z]+) ([a-zA-Z]+)$';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';


  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    return !!form.controls[fieldName].errors && form.controls[fieldName].touched;
  }

  static isValidFieldInArray(formArray: FormArray, index: number): boolean | null {
    return formArray.controls[index].errors && formArray.controls[index].touched
  }

  static getFieldErrorInArray(formArray: FormArray, index: number): string | null {
    if (formArray.controls.length === 0) return null
    const errors = formArray.controls[index].errors ?? {};
    return this.getMessageError(errors);
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};
    return this.getMessageError(errors);
  }

  static isFieldOneEqualFieldTwo(field1: string, field2: string){
    return (formGroup: AbstractControl) => {
      const fieldValue = formGroup.get(field1)?.value;
      const fieldValue2 = formGroup.get(field2)?.value;

      return fieldValue === fieldValue2 ? null : { fieldsNotEquals: true }
    }
  }

  static async checkingServerResponse(control: AbstractControl): Promise<ValidationErrors | null> {
    console.log("validadndo server");
    await sleep();
    const formValue = control.value;
    if (formValue === 'hola@mundo.com') {
      return {
        emailTaken: true
      };
    }
    return null;
  }

  static notStrider(control: AbstractControl): ValidationErrors | null {
    const formValue = control.value;
    if (formValue === 'strider') {
      return {
        noStrider: true
      }
    }
    return null;
  }

  private static getMessageError(errors: ValidationErrors): string | null {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Minimo de ${errors['minlength'].requiredLength} caracteres.`;
        case 'min':
          return `Valor minimo de ${errors['min'].min}`;
        case 'email':
          return 'Email en formato incorrecto';
        case 'noStrider':
          return 'No puedes usar strider';
        case 'pattern':
          if (errors['pattern'].requiredPattern === FormUtils.emailPattern) {
            return "Formato incorrecto";
          } else if (errors['pattern'].requiredPattern === FormUtils.namePattern) {
            return "Debes agrega un nombre y un apellido [ej: Juan Perez]";
          } else if (errors['pattern'].requiredPattern === FormUtils.notOnlySpacesPattern) {
            return "No puedes agregar solo espacios";
          } else {
            return 'Error de patron.';
          }
        case 'emailTaken':
          return "No puedes ocupar este correo";
        default:
          return `Error no controlado ${key}`;
      }
    }

    return null;
  }
}
