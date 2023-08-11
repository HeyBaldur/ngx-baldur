import { NgModule } from '@angular/core';
import { TimeAgoPipe } from './pipes/time-ago.pipe';

@NgModule({
  declarations: [TimeAgoPipe],
  exports: [TimeAgoPipe],
})
export class NgxBaldurModule {}
